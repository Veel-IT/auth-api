import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import {
  ENG_REGEX,
  NUM_REGEX,
  validationOptionsMsg,
} from 'src/common/utils/GLOBAL';

export class UserDto {
  @ApiProperty({
    description: "User's username in the application",
  })
  @IsNotEmpty(validationOptionsMsg('Username cannot be empty'))
  @Matches(
    new RegExp('^[' + ENG_REGEX + NUM_REGEX + '_' + ']{2,40}$'),
    validationOptionsMsg(
      'Username is not correct (a-zA-Z0-9_), or too short (min: 2), or too long (max: 40)',
    ),
  )
  username: string;

  @ApiProperty({
    description: "User's name in the application",
  })
  @IsNotEmpty(validationOptionsMsg('Name cannot be empty'))
  @Matches(
    new RegExp('^[' + ENG_REGEX + ']{2,40}$'),
    validationOptionsMsg(
      'Name is not correct (a-zA-Z), or too short (min: 2), or too long (max: 40)',
    ),
  )
  @MinLength(2, validationOptionsMsg('Name is too short (min: 2)'))
  @MaxLength(50, validationOptionsMsg('Name is too long (max: 50)'))
  name: string;

  @ApiProperty({
    description: "User's password to access account",
  })
  @MinLength(8, validationOptionsMsg('Password is too short (min: 8)'))
  @MaxLength(50, validationOptionsMsg('Password is too long (max: 50)'))
  @Matches(
    /^(?=.*[A-Za-z])(?=.*\d).+$/,
    validationOptionsMsg(
      'The password must include at least 1 digit and 1 letter',
    ),
  )
  @IsNotEmpty(validationOptionsMsg('Password cannot be empty'))
  password: string;
}
