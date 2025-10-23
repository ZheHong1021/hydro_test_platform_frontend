import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

export const useSerialStore = defineStore('serial', () => {
  const port = ref(null);
  const isConnected = ref(false);
  // const receivedData = ref('');
  const receivedData = ref({});
  let reader = null;
  let writer = null;
  let isReading = false; // 🔹 防止重複啟動 readLoop
  let writableStreamClosed = null; // 保存寫入流的 Promise
  let readableStreamClosed = null; // 保存讀取流的 Promise

  /** 連線 */
  const connect = async () => {
    try {
      if (!('serial' in navigator)) {
        ElMessage.warning('瀏覽器不支援 Web Serial API');
        return;
      }

      port.value = await navigator.serial.requestPort();
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

      // 連線成功後立即啟動讀取循環
      readLoop();

      navigator.serial.addEventListener('disconnect', () => {
        isConnected.value = false;
        ElMessage.warning('⚠️ 串口設備已拔除');
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
      return;
    }


    isReading = true;
    const textDecoder = new TextDecoderStream();
    readableStreamClosed = port.value.readable.pipeTo(textDecoder.writable);
    reader = textDecoder.readable.getReader();


    let buffer = ''; // 暫存資料片段

    try {
      while (port.value?.readable) {
        console.log("我有顯示")
        const response = await reader.read();
        console.log("我沒有顯示")
        const { value, done } = response;
        if (done) break; // 如果已經捕捉完畢
        if (!isConnected.value) break; // 如果斷開連線

        if (value) {
          buffer += value; // 累加字串

          // 當遇到換行符號（\r\n 或 \n），表示一筆完整資料
          let lines = buffer.split(/\r?\n/);
          buffer = lines.pop(); // 保留未完整的一段（可能被切開）

          for (const line of lines) {
            console.log("✅ 接收資料:", line);
            if (line.trim() !== '') {
              const values = line.split(':').map(v => v.trim());
              if(values.length === 2) {
                // 使用展開運算子建立新物件，強制觸發 Vue 響應式更新
                receivedData.value = { ...receivedData.value, [values[0]]: values[1] };
              }
              else{
                console.warn("資料格式錯誤，無法解析:", line);
              }

            }
          }
        }
      }
    } catch (err) {
      console.warn('讀取中斷:', err);
    } finally {
      reader.releaseLock();
      isReading = false;
    }
  };

  /** 傳送資料 */
  const send = async (data) => {
    if (!isConnected.value) {
      ElMessage.warning('尚未連線');
      return;
    }

    try {
      console.log("📤 傳送資料:", data);
      await writer.write(data + '\n');
      // readLoop 已在 connect 時啟動，無需重複調用
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
      ElMessage.success("🔌 接口連線已中斷");
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
