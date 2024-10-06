import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class RegisterDto {
    @IsNotEmpty({ message: 'khong duoc de trong' })
    @IsEmail()
    email: string;
    @IsNotEmpty({ message: 'khong duoc de trong' })
    password: string;
    @IsOptional()
    name: string
}
