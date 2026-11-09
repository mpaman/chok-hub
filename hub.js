// ปลุกเว็บที่อยู่บน Render free ตั้งแต่เปิด hub — server หลับหลังว่าง 15 นาที คนแรกต้องรอ ~1 นาที
// ยิงไว้ก่อนตอนคนยังอ่านหน้านี้ พอกดเข้าไป server จะตื่นแล้วหรือใกล้ตื่น
//
// ใช้ mode 'no-cors' เพราะเว็บเพลงไม่ได้เปิด CORS ให้ hub — เราไม่ต้องอ่าน body แค่รู้ว่า server ตอบ
// fetch แบบนี้ resolve เมื่อ server ตอบ (response แบบ opaque) และ reject เมื่อเครือข่าย/DNS ล้ม

const WAKE_TIMEOUT_MS = 90_000; // Render ตื่นช้าสุดราวหนึ่งนาที เผื่อไว้อีกนิด
const SLOW_HINT_MS = 8_000; // เกินนี้ถือว่าหลับอยู่จริง บอกคนดูว่ารอได้

const LABELS = {
  waking: 'กำลังปลุก server…',
  slow: 'server หลับอยู่ กำลังปลุก (ราว 1 นาที) กดเข้าไปรอได้เลย',
  ready: 'พร้อมใช้งาน',
  down: 'ติดต่อ server ไม่ได้ ลองกดเข้าไปดู',
};

function setStatus(el, state, labelKey = state) {
  el.dataset.status = state;
  el.querySelector('.status-text').textContent = LABELS[labelKey];
}

async function wake(card) {
  const status = card.querySelector('.status');
  if (!status) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WAKE_TIMEOUT_MS);
  const slowHint = setTimeout(() => setStatus(status, 'waking', 'slow'), SLOW_HINT_MS);

  try {
    await fetch(card.dataset.wake, { mode: 'no-cors', cache: 'no-store', signal: controller.signal });
    setStatus(status, 'ready');
  } catch (err) {
    // ไม่บล็อกการกดเข้าเว็บ แค่บอกสถานะ — ลิงก์ยังใช้ได้ตามปกติ
    console.warn('ปลุก server ไม่สำเร็จ', card.dataset.wake, err);
    setStatus(status, 'down');
  } finally {
    clearTimeout(timeout);
    clearTimeout(slowHint);
  }
}

document.querySelectorAll('[data-wake]').forEach(wake);
