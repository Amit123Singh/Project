import { Fund, FundDetail } from '../types';

const BASE_URL = 'https://api.mfapi.in/mf';

export const fetchAllFunds = async (): Promise<Fund[]> => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch funds');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching funds:', error);
    throw error;
  }
};

export const fetchFundDetail = async (schemeCode: number): Promise<FundDetail> => {
  try {
    const response = await fetch(`${BASE_URL}/${schemeCode}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch fund detail for scheme ${schemeCode}`);
    }
    const rawData = await response.json();
    
    // Transform the API response to match our FundDetail interface
    // Map snake_case properties to camelCase
    return {
      fund: {
        schemeCode: rawData.meta.scheme_code,
        schemeName: rawData.meta.scheme_name,
        fundHouse: rawData.meta.fund_house,
        schemeType: rawData.meta.scheme_type,
        schemeCategory: rawData.meta.scheme_category,
        schemeStartDate: rawData.meta.scheme_start_date,
        nav: rawData.meta.nav,
        date: rawData.meta.date
      },
      data: rawData.data
    };
  } catch (error) {
    console.error('Error fetching fund detail:', error);
    throw error;
  }
};

export const fetchMultipleFundDetails = async (schemeCodes: number[]): Promise<FundDetail[]> => {
  try {
    const promises = schemeCodes.map(code => fetchFundDetail(code));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error fetching multiple fund details:', error);
    throw error;
  }
};