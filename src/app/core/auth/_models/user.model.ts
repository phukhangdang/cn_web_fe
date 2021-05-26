export class User {
    id: number;
    userName: string;
    password: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    fullname: string;
	phoneNumber: string;

    clear(): void {
        this.id = undefined;
        this.userName = '';
        this.password = '';
        this.email = '';
        this.fullname = '';
        this.accessToken = 'access-token-' + Math.random();
        this.refreshToken = 'access-token-' + Math.random();
        this.phoneNumber = '';
    }
}
