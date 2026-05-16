import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { verifyToken } from '../../common/auth.util';
import { MemberLoginDto, MemberRegisterDto, StaffLoginDto } from './dto/login.dto';
import {
  ChangeMemberPasswordDto,
  UpdateMemberProfileDto,
} from './dto/update-profile.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthService } from './auth.service';

const AVATAR_DIR = join(process.cwd(), 'uploads', 'avatars');

function ensureAvatarDir() {
  if (!existsSync(AVATAR_DIR)) {
    mkdirSync(AVATAR_DIR, { recursive: true });
  }
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('restaurants/:slug/members/register')
  @ApiOperation({ summary: 'Register loyalty member and issue welcome voucher' })
  register(
    @Param('slug') slug: string,
    @Body() body: MemberRegisterDto,
  ) {
    return this.auth.registerMember(slug, body);
  }

  @Post('restaurants/:slug/members/login')
  @ApiOperation({ summary: 'Member login' })
  login(@Param('slug') slug: string, @Body() body: MemberLoginDto) {
    return this.auth.loginMember(slug, body.email, body.password);
  }

  @Post('staff/login')
  @ApiOperation({ summary: 'Restaurant owner/staff login for dashboard & QR scan' })
  staffLogin(@Body() body: StaffLoginDto) {
    return this.auth.loginStaff(body.email, body.password);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Current member profile' })
  me(@Headers('authorization') authHeader?: string) {
    const memberId = this.memberIdFromHeader(authHeader);
    return this.auth.memberProfile(memberId);
  }

  @Patch('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update member profile (name, email, phone, birthday)' })
  updateMe(
    @Headers('authorization') authHeader: string | undefined,
    @Body() body: UpdateMemberProfileDto,
  ) {
    const memberId = this.memberIdFromHeader(authHeader);
    return this.auth.updateMemberProfile(memberId, body);
  }

  @Patch('me/password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change member password' })
  changePassword(
    @Headers('authorization') authHeader: string | undefined,
    @Body() body: ChangeMemberPasswordDto,
  ) {
    const memberId = this.memberIdFromHeader(authHeader);
    return this.auth.changeMemberPassword(
      memberId,
      body.currentPassword,
      body.newPassword,
    );
  }

  @Post('me/bookings')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Book a table' })
  createBooking(
    @Headers('authorization') authHeader: string | undefined,
    @Body() body: CreateBookingDto,
  ) {
    const memberId = this.memberIdFromHeader(authHeader);
    return this.auth.createBooking(memberId, body);
  }

  @Post('me/avatar')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { avatar: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({ summary: 'Upload profile photo' })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          ensureAvatarDir();
          cb(null, AVATAR_DIR);
        },
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname).toLowerCase() || '.jpg';
          const safeExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
            ? ext
            : '.jpg';
          cb(null, `${randomUUID()}${safeExt}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|webp|jpg)$/)) {
          cb(new BadRequestException('Only JPEG, PNG, or WebP images allowed'), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  uploadAvatar(
    @Headers('authorization') authHeader: string | undefined,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const memberId = this.memberIdFromHeader(authHeader);
    if (!file) throw new BadRequestException('No image uploaded');
    return this.auth.updateMemberAvatar(memberId, file.filename);
  }

  private memberIdFromHeader(authHeader?: string): string {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }
    const payload = verifyToken(authHeader.slice(7));
    if (payload.type !== 'member') throw new UnauthorizedException('Members only');
    return payload.sub;
  }
}
