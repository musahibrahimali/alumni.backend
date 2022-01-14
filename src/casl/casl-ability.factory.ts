import { Injectable } from "@nestjs/common";
import { Action } from '../enums/enums';
import { AbilityBuilder, AbilityClass, Ability, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { Client } from 'src/client/schemas/client.schema';
import { Troll } from 'src/troll/schemas/troll.schema';
import { Admin } from 'src/admin/schemas/admin.schema';
import { New } from 'src/news/schemas/news.schema';
import { Blog } from 'src/blog/schemas/blog.schema';
import { Job } from 'src/job/schemas/job.schema';
import { Event } from "src/event/schemas/events.schema";

type Subjects = InferSubjects<typeof Client | typeof Admin | typeof Troll | typeof New | typeof Blog | typeof Event | typeof Job> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: Client | Admin) {
        const { can, cannot, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
            Ability as AbilityClass<AppAbility>
        );

        if (user.isAdmin) {
            can(Action.Manage, 'all');
            can(Action.Manage, Admin);
            can(Action.Manage, Client);
            can(Action.Manage, Troll);
            can(Action.Manage, Event);
            can(Action.Manage, Blog);
            can(Action.Manage, New);
            can(Action.Manage, Job);
        } else {
            can(Action.Read, 'all');
            can(Action.Manage, Troll);
            can(Action.Manage, Client);
            cannot(Action.Manage, Admin);
            cannot(Action.Manage, Event);
            cannot(Action.Manage, Event);
            cannot(Action.Manage, Blog);
            cannot(Action.Manage, Job);
        }
        return build({
            detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>
        });
    }
}
