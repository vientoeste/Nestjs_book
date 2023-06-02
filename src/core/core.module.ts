import { Global, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';

@Global()
@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class CoreModule { }
