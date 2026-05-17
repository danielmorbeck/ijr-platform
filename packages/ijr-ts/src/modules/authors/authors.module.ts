import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './author.entity';
import { AuthorsResolver } from './authors.resolver';
import { AuthorsService } from './authors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  providers: [AuthorsService, AuthorsResolver],
  exports: [AuthorsService, TypeOrmModule],
})
export class AuthorsModule {}
