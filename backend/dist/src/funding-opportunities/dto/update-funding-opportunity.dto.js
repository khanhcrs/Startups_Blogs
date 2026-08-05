"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFundingOpportunityDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_funding_opportunity_dto_1 = require("./create-funding-opportunity.dto");
class UpdateFundingOpportunityDto extends (0, mapped_types_1.PartialType)(create_funding_opportunity_dto_1.CreateFundingOpportunityDto) {
}
exports.UpdateFundingOpportunityDto = UpdateFundingOpportunityDto;
//# sourceMappingURL=update-funding-opportunity.dto.js.map