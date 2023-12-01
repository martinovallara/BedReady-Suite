export default class RepositoryDateZero {
    private static dateZero: Date = new Date(0)
    
    public static setDateZero(dateZero: Date): Date {
        RepositoryDateZero.dateZero = dateZero
        return RepositoryDateZero.dateZero
    }

    public static getDateZero() {
        return RepositoryDateZero.dateZero
    }
}