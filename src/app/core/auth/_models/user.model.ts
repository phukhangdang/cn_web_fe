export class User {
    id: number;
    username: string;
    password: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    fullname: string;
	phoneNumber: string;

    clear(): void {
        this.id = undefined;
        this.username = '';
        this.password = '';
        this.email = '';
        this.fullname = '';
        this.accessToken = 'access-token-' + Math.random();
        this.refreshToken = 'access-token-' + Math.random();
        this.phoneNumber = '';
    }
}
