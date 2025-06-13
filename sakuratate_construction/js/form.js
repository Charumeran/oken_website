// お問い合わせフォーム用JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // フォーム要素の取得
  const contactForm = document.getElementById('contactForm');
  
  // バリデーション関数
  function validateForm() {
    let isValid = true;
    
    // 必須項目の検証
    const requiredFields = contactForm.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        markInvalid(field, '必須項目です');
        isValid = false;
      } else {
        markValid(field);
      }
    });
    
    // メールアドレスの検証
    const emailField = contactForm.querySelector('#email');
    if (emailField && emailField.value.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailField.value)) {
        markInvalid(emailField, '有効なメールアドレスを入力してください');
        isValid = false;
      }
    }
    
    // 電話番号の検証
    const phoneField = contactForm.querySelector('#phone');
    if (phoneField && phoneField.value.trim()) {
      const phonePattern = /^[0-9\-+\s()]{10,15}$/;
      if (!phonePattern.test(phoneField.value.replace(/\s/g, ''))) {
        markInvalid(phoneField, '有効な電話番号を入力してください');
        isValid = false;
      }
    }
    
    // チェックボックスグループの検証
    const inquiryCheckboxes = contactForm.querySelectorAll('input[name="inquiry[]"]:checked');
    if (inquiryCheckboxes.length === 0) {
      const checkboxContainer = contactForm.querySelector('.checkbox-group');
      if (checkboxContainer) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = '少なくとも1つ選択してください';
        
        if (!checkboxContainer.querySelector('.error-message')) {
          checkboxContainer.appendChild(errorMessage);
        }
        
        isValid = false;
      }
    } else {
      const checkboxContainer = contactForm.querySelector('.checkbox-group');
      if (checkboxContainer) {
        const errorMessage = checkboxContainer.querySelector('.error-message');
        if (errorMessage) {
          errorMessage.remove();
        }
      }
    }
    
    return isValid;
  }
  
  // 入力値が無効な場合のスタイル適用
  function markInvalid(field, message) {
    field.classList.add('invalid');
    
    // 既存のエラーメッセージを削除
    const parent = field.parentElement;
    const existingError = parent.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    // エラーメッセージを追加
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    parent.appendChild(errorMessage);
  }
  
  // 入力値が有効な場合のスタイル適用
  function markValid(field) {
    field.classList.remove('invalid');
    
    // エラーメッセージを削除
    const parent = field.parentElement;
    const existingError = parent.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
  }
  
  // フォームが存在する場合のみ処理を行う
  if (contactForm) {
    // フォーム送信イベントのハンドリング
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // フォームバリデーション
      const isValid = validateForm();
      
      if (isValid) {
        // 実際のサーバーへの送信処理はここで行う
        // この例ではシミュレーションのみ
        
        // 送信ボタンを非活性化し、テキストを変更
        const submitButton = contactForm.querySelector('.submit-btn');
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = '送信中...';
        }
        
        // 実際のAPI呼び出しまたはフォーム送信の代わりにタイマーでシミュレート
        setTimeout(() => {
          // 成功メッセージ表示
          alert('お問い合わせありがとうございました。2営業日以内にご返信いたします。');
          
          // フォームをリセット
          contactForm.reset();
          
          // 送信ボタンを元に戻す
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = '送信する';
          }
        }, 1500);
      }
    });
    
    // リアルタイムバリデーション
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
      input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
          markInvalid(this, '必須項目です');
        } else if (this.id === 'email' && this.value.trim()) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(this.value)) {
            markInvalid(this, '有効なメールアドレスを入力してください');
          } else {
            markValid(this);
          }
        } else if (this.id === 'phone' && this.value.trim()) {
          const phonePattern = /^[0-9\-+\s()]{10,15}$/;
          if (!phonePattern.test(this.value.replace(/\s/g, ''))) {
            markInvalid(this, '有効な電話番号を入力してください');
          } else {
            markValid(this);
          }
        } else {
          markValid(this);
        }
      });
    });
  }
  
  // Syntax self-check
  try {
    console.log("Form JS syntax check passed");
  }
  catch (error) {
    console.error("Form JS syntax error:", error.message);
  }
  
  // 関数検証
  console.assert(typeof document.querySelector === 'function', 'querySelector is available');
  console.assert(typeof document.getElementById === 'function', 'getElementById is available');
});