const correctPasscode = "0208";
let enteredPasscode = "";

const dots = document.querySelectorAll('.dot');
const keypad = document.querySelectorAll('.key');
const lockScreen = document.getElementById('lock-screen');
const envelopeScreen = document.getElementById('envelope-screen');
const letterScreen = document.getElementById('letter-screen');
const paperTop = document.getElementById('paper-top');
const letterText = document.getElementById('letter-text');
const pageCount = document.getElementById('page-count');
const statusText = document.getElementById('status-text');
const notebook = document.getElementById('notebook');
const envelopeBtn = document.getElementById('envelope-btn');

// --- 1. XỬ LÝ KHÓA MÀN HÌNH ---
keypad.forEach(key => {
    key.addEventListener('click', () => {
        const num = key.getAttribute('data-num');
        if (!num) return; // Bỏ qua nếu bấm vào ô trống

        if (num === 'DEL') {
            enteredPasscode = enteredPasscode.slice(0, -1);
            updateDots();
        } else {
            if (enteredPasscode.length < 4) {
                enteredPasscode += num;
                updateDots();

                if (enteredPasscode.length === 4) {
                    setTimeout(() => {
                        if (enteredPasscode === correctPasscode) {
                            lockScreen.classList.add('hidden');
                            envelopeScreen.classList.remove('hidden');
                        } else {
                            enteredPasscode = "";
                            updateDots();
                        }
                    }, 300);
                }
            }
        }
    });
});

function updateDots() {
    dots.forEach((dot, index) => {
        if (index < enteredPasscode.length) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// --- 2. XỬ LÝ MỞ PHONG BÌ ---
envelopeBtn.addEventListener('click', function() {
    this.classList.add('open');
    
    setTimeout(() => {
        envelopeScreen.classList.add('hidden');
        letterScreen.classList.remove('hidden');
        startLetterSequence();
    }, 1500);
});

// --- 3. DỮ LIỆU BỨC THƯ ---
const pages = [
    "Gửi em - người con gái anh yêu! ❤️",
    "Từ khi gặp em, anh không nghĩ rằng mình sẽ có những cảm xúc này.",
    "Nhưng khi tiếp xúc với em, ở bên cạnh em... anh lại có một cảm giác kỳ lạ.",
    "Anh dần, luôn suy nghĩ đến em nhiều hơn, muốn được ở bên em nhiều hơn.",
    "Em biết không... em có một giọng nói rất hay và tính cách vui tính.",
    "Và anh muốn thử trở thành một người có thể cùng em chia sẻ những niềm vui, những câu chuyện nhỏ mỗi ngày.",
    "Anh hứa sẽ làm mọi thứ cho em, anh hứa sẽ luôn cho em hạnh phúc, chỉ cần em ... anh.",
    "Vậy nên... anh muốn nói...!",
    "Mong em hãy cho anh một cơ hội được không :33",
    "Làm người yêu anh nhé 🥺❤️"
];

let currentPage = 0;
let isTyping = false;

function typeWriter(text, i, fnCallback) {
    if (i < text.length) {
        letterText.innerHTML = text.substring(0, i + 1).replace(/\n/g, '<br>');
        setTimeout(() => {
            typeWriter(text, i + 1, fnCallback);
        }, 50); 
    } else if (typeof fnCallback == 'function') {
        setTimeout(fnCallback, 400);
    }
}

function startLetterSequence() {
    currentPage = 0;
    paperTop.style.transition = 'none';
    paperTop.classList.remove('throw-left');
    void paperTop.offsetWidth;

    isTyping = true;
    letterText.innerHTML = "";
    pageCount.textContent = `1/${pages.length}`;
    statusText.textContent = "Đợi anh nhắn viết xong nhé...";
    
    typeWriter(pages[0], 0, () => {
        isTyping = false;
        statusText.textContent = "Vuốt ngang để đọc tiếp \u2192";
    });
}

// LOGIC BÓC GIẤY CHUẨN VIDEO
function flipPage() {
    if (isTyping) return;
    isTyping = true;
    
    // Tờ trên cùng bay văng đi
    paperTop.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease';
    paperTop.classList.add('throw-left');

    setTimeout(() => {
        currentPage++;
        
        // Hết 10 trang -> Trở về màn hình khóa
        if (currentPage >= pages.length) {
            currentPage = 0;
            lockScreen.classList.remove('hidden');
            letterScreen.classList.add('hidden');
            enteredPasscode = "";
            updateDots();
            
            envelopeBtn.classList.remove('open');
            paperTop.classList.remove('throw-left');
            isTyping = false;
            return;
        }

        // Đặt tờ giấy ẩn tàng hình quay về giữa
        paperTop.style.transition = 'none';
        paperTop.classList.remove('throw-left');
        
        // Xóa chữ cũ, cập nhật số trang, nhìn như đây là tờ giấy trắng bên dưới
        letterText.innerHTML = "";
        pageCount.textContent = `${currentPage + 1}/${pages.length}`;
        statusText.textContent = "Đợi anh nhắn viết xong nhé...";
        
        void paperTop.offsetWidth;

        // Bắt đầu gõ chữ trực tiếp lên tờ giấy đang nằm giữa
        paperTop.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease';
        
        typeWriter(pages[currentPage], 0, () => {
            isTyping = false;
            if (currentPage === pages.length - 1) {
                statusText.textContent = "Vuốt ngang để khép lại lá thư \u2192";
            } else {
                statusText.textContent = "Vuốt ngang để đọc tiếp \u2192";
            }
        });

    }, 500);
}

notebook.addEventListener('click', flipPage);

let touchStartX = 0;
let touchEndX = 0;

notebook.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

notebook.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 30) {
        flipPage();
    }
});