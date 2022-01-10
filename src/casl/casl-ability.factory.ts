// import { Injectable } from "@nestjs/common";
// import { User } from '../user/schemas/user.schema';
// import { Action } from '../enums/enums';
// import { AbilityBuilder, AbilityClass, Ability, ExtractSubjectType, InferSubjects } from '@casl/ability';
// import { Product } from '../product/schemas/product.schema';

// type Subjects = InferSubjects<typeof User | typeof Product> | 'all';

// export type AppAbility = Ability<[Action, Subjects]>;

// @Injectable()
// export class CaslAbilityFactory {
//     createForUser(user: User) {
//         const { can, cannot, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
//             Ability as AbilityClass<AppAbility>
//         );

//         if (user.isAdmin) {
//             can(Action.Manage, 'all'); // read-write access to everything
//             can(Action.Manage, Product); // read-write access to products
//         } else {
//             can(Action.Read, 'all'); // read-only access to everything
//             cannot(Action.Update, 'all'); // no update access to everything
//             cannot(Action.Delete, 'all'); // no delete access to everything
//             cannot(Action.Create, 'all'); // no create access to everything
//             cannot(Action.Manage, Product); // no manage access to products
//         }

//         return build({
//             detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>
//         });
//     }
// }
