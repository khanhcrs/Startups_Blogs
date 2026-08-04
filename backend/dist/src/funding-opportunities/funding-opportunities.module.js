"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundingOpportunitiesModule = void 0;
const common_1 = require("@nestjs/common");
const funding_opportunities_service_1 = require("./funding-opportunities.service");
const funding_opportunities_controller_1 = require("./funding-opportunities.controller");
let FundingOpportunitiesModule = class FundingOpportunitiesModule {
};
exports.FundingOpportunitiesModule = FundingOpportunitiesModule;
exports.FundingOpportunitiesModule = FundingOpportunitiesModule = __decorate([
    (0, common_1.Module)({
        providers: [funding_opportunities_service_1.FundingOpportunitiesService],
        controllers: [funding_opportunities_controller_1.FundingOpportunitiesController]
    })
], FundingOpportunitiesModule);
//# sourceMappingURL=funding-opportunities.module.js.map