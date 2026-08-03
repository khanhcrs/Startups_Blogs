import { PrismaClient, RoleCode } from '@prisma/client';

const prisma = new PrismaClient();

const taxonomies: Record<string, string[]> = {
  INDUSTRY: ['Food & Beverage', 'Retail', 'Manufacturing', 'Agriculture', 'Technology', 'Education', 'Healthcare', 'Logistics', 'Hospitality', 'Services'],
  BUSINESS_TYPE: ['Small Business', 'Startup', 'Family Business', 'Online Business', 'Franchise', 'Cooperative', 'Social Enterprise', 'Other'],
  BUSINESS_STAGE: ['Idea', 'Early Stage', 'Growth', 'Established'],
  FUNDING_PURPOSE: ['Working Capital', 'Expansion', 'Equipment', 'New Location', 'Product Development', 'Marketing', 'Digital Transformation', 'Export'],
  FUNDING_TYPE: ['Equity Investment', 'Business Loan', 'Revenue Sharing', 'Strategic Partnership', 'Joint Venture', 'Convertible Investment', 'Asset Financing'],
};

const slugify = (value: string) => value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function main() {
  for (const code of Object.values(RoleCode)) {
    await prisma.role.upsert({ where: { code }, create: { code }, update: {} });
  }
  for (const [group, names] of Object.entries(taxonomies)) {
    for (const [sortOrder, name] of names.entries()) {
      const code = slugify(name).replaceAll('-', '_').toUpperCase();
      await prisma.taxonomyItem.upsert({
        where: { group_code: { group, code } },
        create: { group, code, name, slug: slugify(name), sortOrder },
        update: { name, sortOrder, isActive: true },
      });
    }
  }
}

main().finally(() => prisma.$disconnect());
