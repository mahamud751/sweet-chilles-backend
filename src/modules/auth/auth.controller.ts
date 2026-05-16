import { Body, Controller, Get, Headers, Param, Post, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { verifyToken } from '../../common/auth.util';
import { MemberLoginDto, MemberRegisterDto, StaffLoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

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

  private memberIdFromHeader(authHeader?: string): string {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }
    const payload = verifyToken(authHeader.slice(7));
    if (payload.type !== 'member') throw new UnauthorizedException('Members only');
    return payload.sub;
  }
}
