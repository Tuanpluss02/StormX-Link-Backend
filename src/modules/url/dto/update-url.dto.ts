import { IsString, IsNotEmpty, IsAlphanumeric, IsUrl, ValidateIf, ValidateNested } from 'class-validator';

export class UpdateUrlDTO {
  @IsString()
  @IsAlphanumeric()
  @ValidateIf((object, value) => !!(value || object.newLongUrl))
  readonly newUrlCode?: string;

  @IsNotEmpty()
  @IsUrl()
  @ValidateIf((object, value) => !!(value || object.newUrlCode))
  readonly newLongUrl?: string;

  @ValidateNested()
  validate() {
    if (!this.newUrlCode && !this.newLongUrl) {
      throw new Error('At least one field must be provided.');
    }
  }
}