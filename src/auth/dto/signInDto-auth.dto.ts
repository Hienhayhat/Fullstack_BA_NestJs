import { IsNotEmpty } from "class-validator";

export class signInDto {
    @IsNotEmpty({ message: 'khong duoc de trong' })
    username: string;
    @IsNotEmpty({ message: 'khong duoc de trong' })
    password: string;
}
