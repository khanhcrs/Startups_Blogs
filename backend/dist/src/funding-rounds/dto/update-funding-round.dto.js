"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFundingRoundDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_funding_round_dto_1 = require("./create-funding-round.dto");
class UpdateFundingRoundDto extends (0, mapped_types_1.PartialType)(create_funding_round_dto_1.CreateFundingRoundDto) {
}
exports.UpdateFundingRoundDto = UpdateFundingRoundDto;
//# sourceMappingURL=update-funding-round.dto.js.map