import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class CompaniesHouseService {
  private readonly logger = new Logger(CompaniesHouseService.name);
  private readonly apiKey = process.env.COMPANIES_HOUSE_API_KEY;
  private readonly baseUrl = 'https://api.company-information.service.gov.uk';

  async lookupCompany(companyNumber: string) {
    if (!this.apiKey) {
      this.logger.warn('COMPANIES_HOUSE_API_KEY is not set. Mocking response for testing.');
      // Mock fallback for development if key is missing
      return {
        company_number: companyNumber,
        company_name: `MOCK COMPANY ${companyNumber}`,
        company_status: 'active',
        registered_office_address: {
          address_line_1: '123 Mock Street',
          locality: 'London',
          postal_code: 'W1A 1AA',
        }
      };
    }

    try {
      const authHeader = 'Basic ' + Buffer.from(this.apiKey + ':').toString('base64');
      const response = await fetch(`${this.baseUrl}/company/${companyNumber}`, {
        headers: {
          'Authorization': authHeader
        }
      });

      if (response.status === 404) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }

      if (!response.ok) {
        this.logger.error(`Companies House API error: ${response.statusText}`);
        throw new HttpException('Failed to verify company', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return await response.json();
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Error connecting to Companies House: ${error.message}`);
      throw new HttpException('Error communicating with verification service', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
