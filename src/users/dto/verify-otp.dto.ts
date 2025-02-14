import {  IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class VerifyOtpDto {
    @IsPhoneNumber('UZ')
    phone_number: string;

    @IsNotEmpty()
    @IsString()
    otp:string;
    
    @IsNotEmpty()
    @IsString()
    verification_key:string;
}
