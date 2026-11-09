# chok hub

หน้ารวมเว็บของ chok — static HTML ไม่มี build step

- ฟังเพลงกับ chok → https://listen-with-chok.onrender.com
- ปฏิทินวันลาทีม → https://team-leave-beta.vercel.app

`hub.js` ยิง request ไปปลุกเว็บเพลง (Render free จะหลับหลังว่าง 15 นาที) ตั้งแต่เปิดหน้านี้

## รันในเครื่อง
```
python -m http.server 5180
```
(ต้องผ่าน http เพราะ `<script type="module">` ใช้กับ `file://` ไม่ได้)

## เพิ่มเว็บใหม่
copy `<a class="stage">` ใน `index.html` แล้วแก้ลิงก์/ชื่อ/คำอธิบาย ถ้าเว็บอยู่บน host ที่หลับได้ ใส่ `data-wake="<url ที่เบา>"` กับ `<span class="status">`

## Deploy
Vercel → Add New Project → import repo นี้ → Framework = Other, ไม่ต้องตั้ง build command
