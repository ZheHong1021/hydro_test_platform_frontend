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
        // bufferSize: 1024, // 緩衝區大小
      });

      // 設定寫入器
      const textEncoder = new TextEncoderStream();

      const writableStreamClosed = textEncoder.readable.pipeTo(port.value.writable);

      // 取得 writer(用於傳送資料)
      writer = textEncoder.writable.getWriter();

      isConnected.value = true;
      ElMessage.success('接口連線成功');

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
    const readableStreamClosed = port.value.readable.pipeTo(textDecoder.writable);
    reader = textDecoder.readable.getReader();

    let buffer = ''; // 暫存資料片段

    try {
      while (port.value?.readable) {
        const { value, done } = await reader.read();
        if (done) break; // 如果已經捕捉完畢
        if (!isConnected.value) break; // 如果斷開連線

        if (value) {
          buffer += value; // 累加字串

          // 當遇到換行符號（\r\n 或 \n），表示一筆完整資料
          let lines = buffer.split(/\r?\n/);
          buffer = lines.pop(); // 保留未完整的一段（可能被切開）

          for (const line of lines) {
            if (line.trim() !== '') {
              const values = line.split(':').map(v => v.trim());
              if(values.length !== 2) {
                console.warn("資料格式錯誤，無法解析:", line);
                continue;
              }
              
              receivedData.value[values[0]] = values[1];
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
        console.log("⏹️ 釋放 writer");
        try {
          await writer.close?.();
        } catch (_) {
          /* 某些瀏覽器不支援 close() */
        }
        writer.releaseLock?.();
        writer = null;
      }

      // 等待解鎖 decoder/encoder stream
      if (port.value?.readable) {
        try {
          await port.value.readable.cancel();
        } catch (_) { }
        // 等待管線解除鎖定
        await new Promise(r => setTimeout(r, 100));
      }

      if (port.value?.writable) {
        try {
          await port.value.writable.abort();
        } catch (_) { }
        await new Promise(r => setTimeout(r, 100));
      }

      // 關閉 Port
      if (port.value && typeof port.value.close === "function") {
        console.log("🧹 關閉 SerialPort");
        await port.value.close(); // 🔥 這裡現在不會報 locked stream
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
