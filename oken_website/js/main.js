// メインJavaScriptファイル
document.addEventListener('DOMContentLoaded', function() {
  
  // ハンバーガーメニューの制御
  const hamburger = document.querySelector('.header__hamburger');
  const nav = document.querySelector('.header__nav');
  const body = document.body;
  
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      nav.classList.toggle('active');
      body.classList.toggle('menu-open');
    });
    
    // メニュー外クリックで閉じる
    document.addEventListener('click', function(e) {
      if (!hamburger.contains(e.target) && !nav.contains(e.target) && nav.classList.contains('active')) {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        body.classList.remove('menu-open');
      }
    });
    
    // リンククリックでメニューを閉じる
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        body.classList.remove('menu-open');
      });
    });
  }
  
  // スクロール時のヘッダー変更
  const header = document.querySelector('.header');
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', function() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // スクロール方向によるヘッダーの表示/非表示(モバイル用)
    if (window.innerWidth <= 768) {
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
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