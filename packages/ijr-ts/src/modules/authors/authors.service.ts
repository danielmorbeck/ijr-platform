import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './author.entity';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorsRepository: Repository<Author>,
  ) {}

  findAll(): Promise<Author[]> {
    return this.authorsRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Author> {
    const author = await this.authorsRepository.findOne({
      where: { id },
      relations: ['articles'],
    });
    if (!author) {
      throw new NotFoundException(`Author with id "${id}" not found`);
    }
    return author;
  }

  async create(input: CreateAuthorInput): Promise<Author> {
    const existing = await this.authorsRepository.findOne({
      where: { email: input.email },
    });
    if (existing) {
      throw new ConflictException(`Email "${input.email}" is already in use`);
    }

    const author = this.authorsRepository.create(input);
    return this.authorsRepository.save(author);
  }

  async update(id: string, input: UpdateAuthorInput): Promise<Author> {
    const author = await this.findOne(id);

    if (input.email && input.email !== author.email) {
      const existing = await this.authorsRepository.findOne({
        where: { email: input.email },
      });
      if (existing) {
        throw new ConflictException(`Email "${input.email}" is already in use`);
      }
    }

    Object.assign(author, input);
    return this.authorsRepository.save(author);
  }

  async remove(id: string): Promise<boolean> {
    const author = await this.findOne(id);
    if (author.articles && author.articles.length > 0) {
      throw new BadRequestException(
        'Cannot delete author with existing articles',
      );
    }
    await this.authorsRepository.remove(author);
    return true;
  }
}
