import { Global, Module, Scope } from '@nestjs/common';
import { ApplicationService } from '@shared';

@Global()
@Module({
  providers: [
    {
      provide: ApplicationService,
      useClass: ApplicationService,
      scope: Scope.REQUEST,
    },
  ],
  exports: [ApplicationService],
})
export class ApplicationModule {}
