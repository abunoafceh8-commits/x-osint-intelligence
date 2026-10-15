# X-OSINT — منصة استخبارات X.com

> **التصنيف:** OSINT · **المستودع:** `x-osint-intelligence` · **الحالة:** جاهز للاستضافة الثابتة (Static Hosting)

منصة استخبارات متقدمة للتحليل العميق لحسابات X.com. بواسطة ابونواف.

## روابط الموقع الحي والأصول
- https://x-osint-intelligence-coti.arcada.app

## روابط المصدر/التصميم المرجعية
- https://www.designarena.ai/chat/230bf348-7c9d-44f9-93ae-5ecfc0b094e9

## كيفية العمل / ملخص المشروع
تم تنزيل لقطة كاملة من الموقع الحي (https://x-osint-intelligence-coti.arcada.app) تشمل `index.html` وكل الأصول المحلية (JS/CSS/صور) بتاريخ 2026-10-15، وأصبح المشروع جاهزًا للاستضافة الثابتة مباشرة.

- العنوان الأصلي في الموقع: `X-OSINT | ابونواف Intelligence Platform`
- الوصف الأصلي (Meta): Advanced OSINT intelligence platform for deep X.com account analysis. By AbuNawaf.
- هذا مشروع ويب ثابت: افتح `index.html` مباشرة أو استضِف المجلد كاملًا على GitHub أو Vercel أو Netlify أو أي استضافة ثابتة بدون أي خطوة بناء (No build step).
- كل الأصول المحلية التي كان الموقع يعتمد عليها موجودة داخل المستودع في نفس مساراتها الأصلية (`assets/` وغيرها) حتى يعمل الموقع بعد الاستضافة كما كان حيًا.

## الملفات المضمّنة
- `logo.jpg`
- `assets/index-CffsjeGi.js`
- `assets/index-CnzcnQRN.css`
- `abunawaf-logo.jpg`
- `README.md` — هذا الشرح
- `project.json` — بيانات المشروع الوصفية بصيغة JSON
- `SOURCE.md` — مصدر الأرشفة وتاريخها وملاحظات الأمان
- `vercel.json` — إعداد استضافة جاهز لـ Vercel
- `LICENSE` — رخصة MIT

## التشغيل محليًا
```bash
python3 -m http.server 8000
# ثم افتح http://localhost:8000
```

## الاستضافة على Vercel
```bash
npm i -g vercel
vercel --prod
```
أو اربط هذا المستودع من لوحة Vercel وسيُنشر كموقع ثابت مباشرة.

## تحذير الاستخدام المسؤول
استخدم الأدوات في أغراض مشروعة فقط وبما يتوافق مع قوانين بلدك وشروط استخدام المنصات المعنية. لا تُستخدم أدوات OSINT/الأرشيف للتنمّر أو المضايقة أو انتهاك الخصوصية.
