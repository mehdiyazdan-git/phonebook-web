function persianToArabicDigits(persianStr) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    for (let i = 0; i < 10; i++) {
        persianStr = persianStr.replace(new RegExp(persianDigits[i], 'g'), i.toString());
    }
    return persianStr;
}

export default persianToArabicDigits;
