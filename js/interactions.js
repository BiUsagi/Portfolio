/**
 * Portfolio Interactions Module
 * Handles all interactive elements in the portfolio
 */

// PDF Preview Handler
const PDFPreview = {
  viewer: null,
  modal: null,

  /**
   * Initialize the PDF preview functionality
   */
  init() {
    this.viewer = document.getElementById("pdfViewer");
    this.modal = $("#pdfPreviewModal");
    this.setupEventListeners();
  },

  /**
   * Set up event listeners for the PDF viewer
   */
  setupEventListeners() {
    this.viewer.onerror = this.handleError.bind(this);
    this.viewer.onload = this.handleLoad.bind(this);
    this.modal.on("hidden.bs.modal", this.handleModalClose.bind(this));
  },

  /**
   * Open a PDF for preview
   * @param {string} pdfPath - Path to the PDF file
   */
  open(pdfPath) {
    if (!pdfPath) {
      console.error("PDF path is required");
      this.showError("Không thể mở tài liệu. Đường dẫn không hợp lệ.");
      return;
    }

    this.showLoading();
    this.viewer.src = pdfPath;
    this.modal.modal("show");
  },

  /**
   * Show loading state
   */
  showLoading() {
    if (this.viewer) {
      this.viewer.style.opacity = "0.5";
    }
  },

  /**
   * Handle loading errors
   */
  handleError() {
    console.error("Failed to load PDF");
    this.showError("Không thể tải tài liệu. Vui lòng thử lại sau.");
    this.modal.modal("hide");
  },

  /**
   * Show error message to user
   * @param {string} message - Error message to display
   */
  showError(message) {
    alert(message);
  },

  /**
   * Handle successful load
   */
  handleLoad() {
    if (this.viewer) {
      this.viewer.style.opacity = "1";
    }
  },

  /**
   * Clean up when modal is closed
   */
  handleModalClose() {
    if (this.viewer) {
      this.viewer.src = "";
      this.viewer.style.opacity = "1";
    }
  },
};

// Initialize interactions when document is ready
document.addEventListener("DOMContentLoaded", () => {
  PDFPreview.init();
});

// Export for global use
window.openPdfPreview = (pdfPath) => PDFPreview.open(pdfPath);
