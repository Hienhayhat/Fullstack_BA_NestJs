import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    password: string;
    phone: string;
    address: string;
    image: string;
    @IsEmail()
    @IsNotEmpty()
    email: string;


}
