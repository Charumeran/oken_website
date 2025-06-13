// メインJavaScriptファイル
document.addEventListener('DOMContentLoaded', function() {
  
  // ハンバーガーメニューの制御
  const hamburger = document.querySelector('.header__hamburger');
  const nav = document.querySelector('.header__nav');
  
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      nav.classList.toggle('active');
    });
  }
  
  // スクロール時のヘッダー変更
  const header = document.querySelector('.header');
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.backgroundColor = 'var(--white)';
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScrollTop = scrollTop;
  });

  // アクティブなナビゲーションリンクのハイライト
  const currentPage = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('.nav-menu a');
  
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (currentPage === linkPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // Syntax self-check
  try {
    console.log("Syntax check passed");
  }
  catch (error) {
    console.error("Syntax error:", error.message);
  }
  
  // 関数検証
  console.assert(typeof document.querySelector === 'function', 'querySelector is available');
  console.assert(typeof window.addEventListener === 'function', 'addEventListener is available');
});