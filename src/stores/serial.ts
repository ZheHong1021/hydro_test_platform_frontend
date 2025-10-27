import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import { ElMessage } from 'element-plus';

// 定義接收資料的型別
interface ReceivedData {
  [key: string]: string;
}

export const useSerialStore = defineStore('serial', () => {
  const port: Ref<any> = ref(null);
  const isConnected = ref(false);
  const receivedData: Ref<ReceivedData> = ref({});
  let reader: ReadableStreamDefaultReader<string> | null = null;
  let writer: WritableStreamDefaultWriter<string> | null = null;
  let isReading = false; // 防止重複啟動 readLoop
  let writableStreamClosed: Promise<void> | null = null; // 保存寫入流的 Promise
  let readableStreamClosed: Promise<void> | null = null; // 保存讀取流的 Promise

  /** 連線 */
  const connect = async () => {
    try {
      if (!('serial' in navigator)) {
        ElMessage.warning('瀏覽器不支援 Web Serial API');
        return;
      }

      port.value = await (navigator as any).serial.requestPort();
      await port.value.open({
        baudRate: 9600, // 根據需求調整
      });

      // 設定寫入器
      const textEncoder = new TextEncoderStream();

      writableStreamClosed = textEncoder.readable.pipeTo(port.value.writable);

      // 取得 writer(用於傳送資料)
      writer = textEncoder.writable.getWriter();

      isConnected.value = true;
      ElMessage.success('接口連線成功');

      // 不在這裡啟動 readLoop，改在第一次 send 時啟動
      // readLoop();

      (navigator as any).serial.addEventListener('disconnect', () => {
        isConnected.value = false;
        ElMessage.warning('串口設備已拔除');
      });

    } catch (err) {
      console.error('連線失敗:', err);
      ElMessage.error('❌ 連線失敗');
    }
  };

  /** 讀取資料（手動啟動） */
  const readLoop = async () => {
    if (!isConnected.value) {
      ElMessage.warning('尚未連線');
      return;
    }

    if (isReading) {
      console.log("⚠️ readLoop 已在運行中，跳過重複啟動");
      return;
    }

    console.log("🔄 readLoop 開始執行");
    isReading = true;
    const textDecoder = new TextDecoderStream();
    readableStreamClosed = port.value!.readable.pipeTo(textDecoder.writable);
    reader = textDecoder.readable.getReader();

    let buffer = ''; // 暫存資料片段

    try {
      while (port.value?.readable) {
        console.log("⏳ 等待串口資料...")
        const response = await reader.read();
        console.log("📥 收到串口回應:", response)
        const { value, done } = response;
        if (done) {
          console.log("🛑 串口讀取已完成 (done=true)");
          break;
        }
        if (!isConnected.value) {
          console.log("🔌 串口已斷線，停止讀取");
          break;
        }

        if (value) {
          console.log("📝 原始資料片段:", JSON.stringify(value));
          buffer += value; // 累加字串

          // 當遇到換行符號（\r\n 或 \n），表示一筆完整資料
          let lines = buffer.split(/\r?\n/);
          buffer = lines.pop() || ''; // 保留未完整的一段（可能被切開）
          console.log(`📋 解析出 ${lines.length} 行資料，緩衝區剩餘: ${JSON.stringify(buffer)}`);

          for (const line of lines) {
            console.log("✅ 接收完整資料行:", line);
            if (line.trim() !== '') {
              const values = line.split(':').map(v => v.trim());
              if(values.length === 2 && values[0] && values[1]) {
                // 使用展開運算子建立新物件，強制觸發 Vue 響應式更新
                const key: string = values[0];
                const val: string = values[1];
                console.log(`💾 儲存資料: ${key} = ${val}`);
                receivedData.value = { ...receivedData.value, [key]: val };
              }
              else{
                console.warn("⚠️ 資料格式錯誤，無法解析:", line, "解析結果:", values);
              }

            }
          }
        } else {
          console.log("⚠️ 收到空值 (value is null/undefined)");
        }
      }
    } catch (err) {
      console.warn('讀取中斷:', err);
    } finally {
      reader?.releaseLock();
      isReading = false;
    }
  };

  /** 傳送資料 */
  const send = async (data: string) => {
    if (!isConnected.value) {
      ElMessage.warning('尚未連線');
      return;
    }

    try {
      console.log("📤 傳送資料:", data);
      await writer!.write(data + '\n');
      console.log("✅ 指令已送出");

      // 第一次 send 時啟動 readLoop（只會啟動一次，因為有 isReading 保護）
      if (!isReading) {
        readLoop();
      }

      // 超時檢測：2 秒後檢查是否有收到回應
      const timeoutMs = 2000;
      const startTime = Date.now();
      const initialDataState = JSON.stringify(receivedData.value);

      setTimeout(() => {
        const currentDataState = JSON.stringify(receivedData.value);
        const elapsed = Date.now() - startTime;

        if (currentDataState === initialDataState) {
          console.log(`⏸️ 超時 (${elapsed}ms)：設備未回應「${data}」（這可能是正常的，設備可能不會對此指令回應）`);
        } else {
          console.log(`✅ 設備已回應 (${elapsed}ms 內)`);
        }
      }, timeoutMs);

    }
    catch (err) {
      console.error('寫入失敗:', err);
      ElMessage.error('❌ 串口寫入失敗，請重新連線');
    }
  };

  /** 斷開連線 */
  const disconnect = async () => {
    console.log("🔌 嘗試關閉接口...");

    try {
      // 停止讀取
      if (reader) {
        console.log("⏹️ 取消 reader");
        try {
          await reader.cancel();
        } catch (_) {
          /* 讀取已停止 */
        }
        reader.releaseLock();
        reader = null;
      }

      // 停止寫入
      if (writer) {
        console.log("⏹️ 關閉 writer");
        try {
          await writer.close();
        } catch (_) {
          /* 某些瀏覽器不支援 close() */
        }
        writer.releaseLock();
        writer = null;
      }

      // 等待 pipeTo 完成
      if (readableStreamClosed) {
        try {
          await readableStreamClosed;
        } catch (_) {
          /* Stream 可能已被取消 */
        }
        readableStreamClosed = null;
      }

      if (writableStreamClosed) {
        try {
          await writableStreamClosed;
        } catch (_) {
          /* Stream 可能已被取消 */
        }
        writableStreamClosed = null;
      }

      // 關閉 Port
      if (port.value && typeof port.value.close === "function") {
        console.log("🧹 關閉 SerialPort");
        await port.value.close();
      }

      console.log("✅ 接口已安全關閉");
      isConnected.value = false;
      ElMessage.success("接口連線已中斷");
    } catch (err) {
      console.error("❌ 斷線錯誤:", err);
    } finally {
      port.value = null;
      receivedData.value = {};
      isReading = false;
    }
  };


  return { port, isConnected, receivedData, connect, send, disconnect, readLoop }
},
  { // 啟用持久化
    // persist: true
    persist: false
  });
