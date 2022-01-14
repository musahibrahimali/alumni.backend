import { Action } from '../../enums/actions.enum';
import { AppAbility } from '../../casl/casl-ability.factory';
import { IPolicyHandler } from '../../interface/interfaces';
import { Troll } from '../../troll/schemas/troll.schema';

export class ReadTrollPolicyHandler implements IPolicyHandler {
    handle(ability: AppAbility) {
        return ability.can(Action.Read, Troll);
    }
}

