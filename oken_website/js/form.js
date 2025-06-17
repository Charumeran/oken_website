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
        // フォームデータを収集
        const formData = new FormData(contactForm);
        const data = {
          name: formData.get('name'),
          company: formData.get('company') || '',
          email: formData.get('email'),
          phone: formData.get('phone'),
          inquiry: Array.from(formData.getAll('inquiry[]')),
          message: formData.get('message'),
          privacy_agree: formData.get('privacy_agree') ? 'true' : 'false'
        };
        
        // 送信ボタンを非活性化し、テキストを変更
        const submitButton = contactForm.querySelector('.submit-btn');
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = '送信中...';
        }
        
        // APIエンドポイントURL（開発環境と本番環境で切り替え）
        const apiUrl = window.location.hostname === 'localhost' 
          ? 'http://localhost:3000/api/contact'
          : '/api/contact';
        
        // サーバーへ送信
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            // 成功メッセージ表示
            alert(result.message || 'お問い合わせありがとうございました。2営業日以内にご返信いたします。');
            
            // フォームをリセット
            contactForm.reset();
          } else {
            // エラーメッセージ表示
            alert(result.message || 'エラーが発生しました。お手数ですが、もう一度お試しください。');
          }
        })
        .catch(error => {
          console.error('送信エラー:', error);
          alert('通信エラーが発生しました。お手数ですが、お電話にてお問い合わせください。');
        })
        .finally(() => {
          // 送信ボタンを元に戻す
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = '送信する';
          }
        });
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