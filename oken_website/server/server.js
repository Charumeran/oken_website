const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// メール送信設定
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// バリデーションルール
const contactValidation = [
  body('name').notEmpty().withMessage('お名前は必須です'),
  body('email').isEmail().withMessage('有効なメールアドレスを入力してください'),
  body('phone').notEmpty().withMessage('電話番号は必須です'),
  body('message').notEmpty().withMessage('お問い合わせ内容は必須です'),
  body('inquiry').isArray({ min: 1 }).withMessage('お問い合わせ項目を選択してください'),
  body('privacy_agree').equals('true').withMessage('個人情報保護方針に同意してください')
];

// ルート
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// お問い合わせフォーム送信エンドポイント
app.post('/api/contact', contactValidation, async (req, res) => {
  // バリデーションエラーチェック
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, company, email, phone, inquiry, message } = req.body;

  // メールの内容を作成
  const mailContent = `
お問い合わせを受け付けました。

【お問い合わせ内容】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

■ お名前
${name}

■ 会社名・団体名
${company || 'なし'}

■ メールアドレス
${email}

■ 電話番号
${phone}

■ お問い合わせ項目
${inquiry.join(', ')}

■ お問い合わせ詳細
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

受信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
`;

  // 管理者向けメール
  const adminMailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.ADMIN_EMAIL || 'info@o--ken.co.jp',
    subject: `【お問い合わせ】${name}様より`,
    text: mailContent
  };

  // お客様向け自動返信メール
  const customerMailContent = `
${name} 様

この度は、株式会社櫻建にお問い合わせいただき、誠にありがとうございます。
以下の内容でお問い合わせを受け付けました。

${mailContent}

担当者より2営業日以内にご連絡させていただきます。
今しばらくお待ちくださいますようお願い申し上げます。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

株式会社櫻建
〒861-1112 熊本県合志市野々島5178-1
TEL: 096-348-5501
FAX: 096-348-5502
Email: info@o--ken.co.jp
営業時間: 平日 9:00-17:00

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  const customerMailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: '【株式会社櫻建】お問い合わせありがとうございます',
    text: customerMailContent
  };

  try {
    // 管理者へメール送信
    await transporter.sendMail(adminMailOptions);
    
    // お客様へ自動返信メール送信
    await transporter.sendMail(customerMailOptions);

    res.json({
      success: true,
      message: 'お問い合わせを受け付けました。2営業日以内にご連絡いたします。'
    });
  } catch (error) {
    console.error('メール送信エラー:', error);
    res.status(500).json({
      success: false,
      message: 'メール送信に失敗しました。お手数ですが、お電話にてお問い合わせください。'
    });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});