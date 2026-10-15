// ** @description
// Manages user authentication state and securely stores JWT credentials.


import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';


export interface AuthResponse {
    accessToken: string;
    tokenType: 'Bearer';
    user: {
        username: string;
        displayName: string;
        roles: string[];
    };
}

@Service()
export class AuthService {
    http = inject(HttpClient);

    hasTokenAndRoles(): boolean {
        const token = sessionStorage.getItem('token');
        const storedRoles = sessionStorage.getItem('roles');

        if (!token?.trim() || !storedRoles) {
            return false;
        }

        const roles = JSON.parse(storedRoles);
        return Array.isArray(roles) && roles.length > 0
    }

    login(username:string, password:string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiBaseUrl}/auth/login`, { username, password })
    }
}
