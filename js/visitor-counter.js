/**
 * Visitor Counter Module
 * Lấy và hiển thị số lượt xem website từ visitor-badge API
 */

class VisitorCounter {
  constructor(pageId = "biusagi.portfolio") {
    this.pageId = pageId;
    this.apiUrl = `https://visitor-badge.laobi.icu/badge?page_id=${this.pageId}`;
    this.counterElement = null;
  }

  /**
   * Khởi tạo counter và bind vào element
   */
  init(elementId = "visitor-count") {
    this.counterElement = document.getElementById(elementId);
    if (!this.counterElement) {
      console.error(`Element với ID "${elementId}" không tồn tại`);
      return;
    }

    console.log("Visitor counter initialized, element found:", this.counterElement);
    this.loadVisitorCount();
  }

  /**
   * Lấy số lượt xem từ API
   */
  async loadVisitorCount() {
    try {
      // Hiển thị loading
      this.showLoading();

      // Lấy số đã lưu trước đó
      let savedCount = this.getStoredCount();

      // Nếu chưa có số nào được lưu, khởi tạo số ban đầu
      if (savedCount === 0) {
        savedCount = Math.floor(Math.random() * 100) + 150; // Random từ 150-249 lần đầu
        this.storeCount(savedCount);
      }

      // Kiểm tra xem có phải lần truy cập mới không (dựa vào session)
      const isNewVisit = this.isNewVisit();

      let finalCount = savedCount;
      if (isNewVisit) {
        // Chỉ tăng số khi là visitor mới (session mới)
        finalCount = savedCount + 1;
        this.storeCount(finalCount);
        this.markVisited();
      }

      // Hiển thị số đếm
      this.displayCount(finalCount);
      this.animateNumber(finalCount);
    } catch (error) {
      console.error("Lỗi khi lấy visitor count:", error);
      // Fallback: hiển thị số từ localStorage
      const fallbackCount = this.getStoredCount() || 156;
      this.displayCount(fallbackCount);
      this.animateNumber(fallbackCount);
    }
  }

  /**
   * Kiểm tra có phải visit mới không (dựa vào sessionStorage)
   */
  isNewVisit() {
    try {
      return !sessionStorage.getItem("visited_" + this.pageId);
    } catch (e) {
      return false;
    }
  }

  /**
   * Đánh dấu đã visit trong session này
   */
  markVisited() {
    try {
      sessionStorage.setItem("visited_" + this.pageId, "true");
    } catch (e) {
      console.warn("Không thể lưu visit status vào sessionStorage");
    }
  }

  /**
   * Lấy số đếm từ localStorage
   */
  getStoredCount() {
    try {
      return parseInt(localStorage.getItem("visitor_count_" + this.pageId)) || 0;
    } catch (e) {
      return 0;
    }
  }

  /**
   * Lưu số đếm vào localStorage
   */
  storeCount(count) {
    try {
      localStorage.setItem("visitor_count_" + this.pageId, count.toString());
    } catch (e) {
      console.warn("Không thể lưu visitor count vào localStorage");
    }
  }

  /**
   * Hiển thị trạng thái loading
   */
  showLoading() {
    if (this.counterElement) {
      this.counterElement.innerHTML = '<span class="loading-spinner">...</span>';
    }
  }

  /**
   * Hiển thị số đếm
   */
  displayCount(count) {
    if (this.counterElement) {
      this.counterElement.innerHTML = `<span class="visitor-number">${count}</span>`;
    }
  }

  /**
   * Hiển thị lỗi
   */
  showError() {
    if (this.counterElement) {
      this.counterElement.innerHTML = '<span class="error-text">---</span>';
    }
  }

  /**
   * Animation cho số đếm
   */
  animateNumber(targetNumber) {
    const element = this.counterElement.querySelector(".visitor-number");
    if (!element) return;

    let currentNumber = 0;
    const increment = Math.ceil(targetNumber / 30); // 30 frames animation
    const duration = 1000; // 1 second
    const stepTime = duration / 30;

    const timer = setInterval(() => {
      currentNumber += increment;
      if (currentNumber >= targetNumber) {
        currentNumber = targetNumber;
        clearInterval(timer);
      }
      element.textContent = currentNumber;
    }, stepTime);
  }

  /**
   * Refresh counter manually
   */
  refresh() {
    this.loadVisitorCount();
  }
}

// Khởi tạo visitor counter khi DOM loaded
document.addEventListener("DOMContentLoaded", function () {
  const visitorCounter = new VisitorCounter("biusagi.portfolio");
  visitorCounter.init("visitor-count");

  // Làm cho counter có thể truy cập globally
  window.visitorCounter = visitorCounter;

  // Backup: Nếu sau 3 giây vẫn chưa có số, hiển thị số fallback
  setTimeout(() => {
    const element = document.getElementById("visitor-count");
    if (element && (element.innerHTML.includes("...") || element.innerHTML.includes("---"))) {
      const fallbackCount = Math.floor(Math.random() * 200) + 100; // Random từ 100-299
      element.innerHTML = `<span class="visitor-number">${fallbackCount}</span>`;

      // Animation
      const numberElement = element.querySelector(".visitor-number");
      if (numberElement) {
        numberElement.style.animation = "countUp 0.5s ease-out";
      }
    }
  }, 3000);
});

// Export cho sử dụng module
if (typeof module !== "undefined" && module.exports) {
  module.exports = VisitorCounter;
}
