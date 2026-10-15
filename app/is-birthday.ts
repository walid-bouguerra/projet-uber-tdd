export function isBirthday(birthDate: Date | undefined, today: Date): boolean {
    return (
        today.getDate() === birthDate?.getDate() &&
        today.getMonth() === birthDate?.getMonth()
    );
}