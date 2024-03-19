import moment from "jalali-moment";
export function toShamsi(date) {
    try {

        const _date = new Date(date[0], date[1] - 1, date[2]);

        return moment(_date, "YYYY-MM-DD").locale("fa").format("YYYY/MM/DD");
    } catch (error) {
        console.error("خطا در تبدیل تاریخ شمسی:", error);
        return "";
    }
}

export const formatNumber = (number) => {
    try {
        if (number === null || number === undefined) {
            return "";
        }

        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } catch (error) {
        console.error(error.message);
        return "";
    }
};