// js/auth.js

// مفتاح تخزين المستخدمين في localStorage
const STORAGE_KEY = 'medlab_users';

// دالة للحصول على جميع المستخدمين المخزنين
function getUsers() {
    const users = localStorage.getItem(STORAGE_KEY);
    if (users) {
        return JSON.parse(users);
    }
    return [];
}

// دالة لحفظ المستخدمين
function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// دالة لإضافة مستخدم جديد
function addUser(userData) {
    const users = getUsers();
    
    // التحقق من وجود اسم المستخدم مسبقاً
    if (users.some(user => user.username === userData.username)) {
        throw new Error('اسم المستخدم موجود بالفعل');
    }
    
    // التحقق من وجود البريد الإلكتروني مسبقاً
    if (users.some(user => user.email === userData.email)) {
        throw new Error('البريد الإلكتروني موجود بالفعل');
    }
    
    // إضافة المستخدم الجديد
    users.push(userData);
    saveUsers(users);
    return userData;
}

// دالة للتحقق من بيانات تسجيل الدخول
function verifyUser(username, password) {
    const users = getUsers();
    console.log('All users:', users); // للتأكد من وجود المستخدمين
    console.log('Trying to login with:', username, password); // للتأكد من البيانات المدخلة
    
    // البحث عن المستخدم (مطابقة تامة للحروف والمسافات)
    const user = users.find(user => user.username === username && user.password === password);
    
    console.log('Found user:', user); // للتأكد من العثور على المستخدم
    
    if (user) {
        // حفظ حالة تسجيل الدخول
        const currentUser = {
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            phone: user.phone
        };
        localStorage.setItem('current_user', JSON.stringify(currentUser));
        console.log('User logged in successfully:', currentUser);
        return true;
    }
    
    return false;
}

// دالة للتحقق من صحة البريد الإلكتروني
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return emailRegex.test(email);
}

// دالة للتحقق من صحة رقم الهاتف (أرقام فقط)
function isValidPhone(phone) {
    const phoneRegex = /^[0-9]+$/;
    return phoneRegex.test(phone);
}

// دالة للتحقق من قوة كلمة المرور
function isValidPassword(password) {
    return password.length >= 8;
}

// دالة لعرض رسالة الخطأ
function showError(element, message) {
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        
        // إخفاء رسالة الخطأ بعد 5 ثواني
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

// دالة لعرض رسالة نجاح
function showSuccess(element, message) {
    if (element) {
        element.textContent = message;
        element.style.color = '#28a745';
        element.style.display = 'block';
        
        // إخفاء رسالة النجاح بعد 3 ثواني
        setTimeout(() => {
            element.style.display = 'none';
            element.style.color = '#d9534f'; // إعادة اللون الأصلي
        }, 3000);
    }
}

// تهيئة صفحة تسجيل الدخول
function initLoginPage() {
    const loginForm = document.getElementById('login-form');
    const errorMessageDiv = document.getElementById('error-message');
    
    // التحقق من وجود المستخدمين المخزنين مسبقاً
    const users = getUsers();
    console.log('Existing users on login page:', users);
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            console.log('Login attempt - Username:', username, 'Password:', password);
            
            // التحقق من وجود بيانات
            if (!username || !password) {
                showError(errorMessageDiv, 'الرجاء إدخال اسم المستخدم وكلمة المرور');
                return;
            }
            
            // التحقق من بيانات المستخدم (مطابقة تامة)
            const isValid = verifyUser(username, password);
            
            console.log('Login validation result:', isValid);
            
            if (isValid) {
                // تسجيل الدخول ناجح - توجيه إلى الصفحة الرئيسية
                console.log('Redirecting to index.html');
                window.location.href = 'index.html';
            } else {
                // رسالة خطأ عامة
                showError(errorMessageDiv, 'اسم المستخدم أو كلمة المرور غير صحيحة');
            }
        });
    }
}

// تهيئة صفحة التسجيل الجديد
function initRegisterPage() {
    const registerForm = document.getElementById('register-form');
    const errorMessageDiv = document.getElementById('error-message');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // جمع البيانات من النموذج
            const fullname = document.getElementById('fullname').value.trim();
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            console.log('Register attempt:', {fullname, username, email, phone});
            
            // التحقق من الحقول المطلوبة
            if (!fullname || !username || !email || !phone || !password || !confirmPassword) {
                showError(errorMessageDiv, 'الرجاء تعبئة جميع الحقول');
                return;
            }
            
            // التحقق من تطابق كلمة المرور
            if (password !== confirmPassword) {
                showError(errorMessageDiv, 'كلمة المرور وتأكيد كلمة المرور غير متطابقتين');
                return;
            }
            
            // التحقق من قوة كلمة المرور
            if (!isValidPassword(password)) {
                showError(errorMessageDiv, 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل');
                return;
            }
            
            // التحقق من صحة البريد الإلكتروني
            if (!isValidEmail(email)) {
                showError(errorMessageDiv, 'الرجاء إدخال بريد إلكتروني صحيح');
                return;
            }
            
            // التحقق من صحة رقم الهاتف
            if (!isValidPhone(phone)) {
                showError(errorMessageDiv, 'الرجاء إدخال رقم هاتف صحيح (أرقام فقط)');
                return;
            }
            
            try {
                // محاولة إضافة المستخدم الجديد
                addUser({
                    fullname: fullname,
                    username: username,
                    email: email,
                    phone: phone,
                    password: password
                });
                
                // عرض رسالة نجاح قبل التحويل
                showSuccess(errorMessageDiv, 'تم إنشاء الحساب بنجاح! جاري التحويل إلى صفحة تسجيل الدخول...');
                
                // تأخير التحويل لظهور رسالة النجاح
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                
            } catch (error) {
                console.error('Registration error:', error);
                showError(errorMessageDiv, error.message);
            }
        });
    }
}

// دالة للتحقق من حالة تسجيل الدخول (للصفحات المحمية)
function checkAuth() {
    const currentUser = localStorage.getItem('current_user');
    const currentPage = window.location.pathname.split('/').pop();
    
    console.log('Check auth - Current user:', currentUser);
    console.log('Current page:', currentPage);
    
    // إذا كانت الصفحة هي login أو register، لا نمنع الوصول
    if (currentPage === 'login.html' || currentPage === 'register.html' || currentPage === '') {
        return true;
    }
    
    // إذا كانت الصفحة محمية ولا يوجد مستخدم مسجل دخول
    if (!currentUser) {
        console.log('No user logged in, redirecting to login');
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// دالة لتسجيل الخروج
function logout() {
    localStorage.removeItem('current_user');
    window.location.href = 'login.html';
}

// تهيئة الصفحة المناسبة عند تحميلها
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - Current URL:', window.location.href);
    
    // تحديد الصفحة الحالية وتهيئتها
    const currentPage = window.location.pathname.split('/').pop();
    console.log('Current page:', currentPage);
    
    if (currentPage === 'login.html') {
        console.log('Initializing login page');
        initLoginPage();
    } else if (currentPage === 'register.html') {
        console.log('Initializing register page');
        initRegisterPage();
    }
});