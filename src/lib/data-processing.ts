import Papa from "papaparse";

// Simplified interface for components
export interface SustainabilityData {
  Country: string;
  Year: number;
  Region: string;
  "Income group": string;
  "Carbon emissions (metric tons per capita)": number | null;
  "Renewable energy consumption (% of total final energy consumption)":
    | number
    | null;
  "GDP per capita (current US$)": number | null;
  "Life expectancy at birth, total (years)": number | null;
  "Forest area (% of land area)": number | null;
  [key: string]: any;
}

// Full raw data interface
export interface RawSustainabilityData {
  "Country Name": string;
  "Country Code": string;
  Year: number;
  "Access to electricity (% of population) - EG.ELC.ACCS.ZS": number | null;
  "Adjusted net national income per capita (annual % growth) - NY.ADJ.NNTY.PC.KD.ZG":
    | number
    | null;
  "Adjusted net savings, excluding particulate emission damage (% of GNI) - NY.ADJ.SVNX.GN.ZS":
    | number
    | null;
  "Adjusted savings: carbon dioxide damage (% of GNI) - NY.ADJ.DCO2.GN.ZS":
    | number
    | null;
  "Adjusted savings: natural resources depletion (% of GNI) - NY.ADJ.DRES.GN.ZS":
    | number
    | null;
  "Adjusted savings: net forest depletion (% of GNI) - NY.ADJ.DFOR.GN.ZS":
    | number
    | null;
  "Adjusted savings: particulate emission damage (% of GNI) - NY.ADJ.DPEM.GN.ZS":
    | number
    | null;
  "Automated teller machines (ATMs) (per 100,000 adults) - FB.ATM.TOTL.P5":
    | number
    | null;
  "Broad money (% of GDP) - FM.LBL.BMNY.GD.ZS": number | null;
  "Children out of school (% of primary school age) - SE.PRM.UNER.ZS":
    | number
    | null;
  "Compulsory education, duration (years) - SE.COM.DURS": number | null;
  "Cost of business start-up procedures, female (% of GNI per capita) - IC.REG.COST.PC.FE.ZS":
    | number
    | null;
  "Cost of business start-up procedures, male (% of GNI per capita) - IC.REG.COST.PC.MA.ZS":
    | number
    | null;
  "Exports of goods and services (% of GDP) - NE.EXP.GNFS.ZS": number | null;
  "Final consumption expenditure (% of GDP) - NE.CON.TOTL.ZS": number | null;
  "GDP (current US$) - NY.GDP.MKTP.CD": number | null;
  "GDP per capita (current US$) - NY.GDP.PCAP.CD": number | null;
  "General government final consumption expenditure (% of GDP) - NE.CON.GOVT.ZS":
    | number
    | null;
  "Gross national expenditure (% of GDP) - NE.DAB.TOTL.ZS": number | null;
  "Gross savings (% of GDP) - NY.GNS.ICTR.ZS": number | null;
  "Imports of goods and services (% of GDP) - NE.IMP.GNFS.ZS": number | null;
  "Inflation, consumer prices (annual %) - FP.CPI.TOTL.ZG": number | null;
  "Primary completion rate, total (% of relevant age group) - SE.PRM.CMPT.ZS":
    | number
    | null;
  "Proportion of seats held by women in national parliaments (%) - SG.GEN.PARL.ZS":
    | number
    | null;
  "Pupil-teacher ratio, primary - SE.PRM.ENRL.TC.ZS": number | null;
  "Renewable electricity output (% of total electricity output) - EG.ELC.RNEW.ZS":
    | number
    | null;
  "Renewable energy consumption (% of total final energy consumption) - EG.FEC.RNEW.ZS":
    | number
    | null;
  "School enrollment, preprimary (% gross) - SE.PRE.ENRR": number | null;
  "School enrollment, primary (% gross) - SE.PRM.ENRR": number | null;
  "School enrollment, secondary (% gross) - SE.SEC.ENRR": number | null;
  "Trade (% of GDP) - NE.TRD.GNFS.ZS": number | null;
  "Women Business and the Law Index Score (scale 1-100) - SG.LAW.INDX":
    | number
    | null;
  "Prevalence of undernourishment (%) - SN_ITK_DEFC - 2.1.1": number | null;
  "Proportion of population below international poverty line (%) - SI_POV_DAY1 - 1.1.1":
    | number
    | null;
  "Proportion of population covered by at least a 2G mobile network (%) - IT_MOB_2GNTWK - 9.c.1":
    | number
    | null;
  "Proportion of population covered by at least a 3G mobile network (%) - IT_MOB_3GNTWK - 9.c.1":
    | number
    | null;
  "Proportion of population using basic drinking water services (%) - SP_ACS_BSRVH2O - 1.4.1":
    | number
    | null;
  "Unemployment rate, male (%) - SL_TLF_UEM - 8.5.2": number | null;
  "Unemployment rate, women (%) - SL_TLF_UEM - 8.5.2": number | null;
  "Annual production-based emissions of carbon dioxide (CO2), measured in million tonnes":
    | number
    | null;
  Continent: string;
  "Gini index (World Bank estimate) - SI.POV.GINI": number | null;
  "Income Classification (World Bank Definition)": string;
  "Individuals using the Internet (% of population) - IT.NET.USER.ZS":
    | number
    | null;
  "Life expectancy at birth, total (years) - SP.DYN.LE00.IN": number | null;
  "Population, total - SP.POP.TOTL": number | null;
  "Regime Type (RoW Measure Definition)": string;
  "Rural population (% of total population) - SP.RUR.TOTL.ZS": number | null;
  "Total natural resources rents (% of GDP) - NY.GDP.TOTL.RT.ZS": number | null;
  "Urban population (% of total population) - SP.URB.TOTL.IN.ZS": number | null;
  "World Regions (UN SDG Definition)": string;
}

export interface FilterOptions {
  countries?: string[];
  years?: number[];
  continents?: string[];
  incomeClassifications?: string[];
  regimeTypes?: string[];
  searchTerm?: string;
}

export interface DatasetInfo {
  name: string;
  description: string;
  source: string;
  lastUpdated: string;
  totalRecords: number;
  countries: number;
  yearRange: [number, number];
  metrics: number;
}

export class SustainabilityDataProcessor {
  private rawData: RawSustainabilityData[] = [];
  private data: SustainabilityData[] = [];
  private isLoaded = false;

  async loadData(): Promise<void> {
    if (this.isLoaded) return;

    try {
      const response = await fetch("/data/WorldSustainabilityDataset.csv");
      const csvText = await response.text();

      const result = Papa.parse<RawSustainabilityData>(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        transform: (value, field) => {
          if (value === "" || value === "null" || value === undefined) {
            return null;
          }
          if (field === "Year" && typeof value === "string") {
            return parseInt(value, 10);
          }
          return value;
        },
      });

      if (result.errors.length > 0) {
        console.warn("CSV parsing warnings:", result.errors);
      }

      this.rawData = result.data.filter(
        (row) => row["Country Name"] && row["Country Code"] && row.Year
      );

      // Transform raw data to simplified format
      this.data = this.rawData.map((row) => ({
        ...row, // Include all original fields first
        Country: row["Country Name"],
        Year: row.Year,
        Region:
          row.Continent ||
          row["World Regions (UN SDG Definition)"] ||
          "Unknown",
        "Income group":
          row["Income Classification (World Bank Definition)"] || "Unknown",
        "Carbon emissions (metric tons per capita)":
          row[
            "Annual production-based emissions of carbon dioxide (CO2), measured in million tonnes"
          ],
        "Renewable energy consumption (% of total final energy consumption)":
          row[
            "Renewable energy consumption (% of total final energy consumption) - EG.FEC.RNEW.ZS"
          ],
        "GDP per capita (current US$)":
          row["GDP per capita (current US$) - NY.GDP.PCAP.CD"],
        "Life expectancy at birth, total (years)":
          row["Life expectancy at birth, total (years) - SP.DYN.LE00.IN"],
        "Forest area (% of land area)": null, // This field might not exist in the dataset
      }));

      this.isLoaded = true;
    } catch (error) {
      console.error("Error loading sustainability data:", error);
      throw new Error("Failed to load sustainability dataset");
    }
  }

  getData(): SustainabilityData[] {
    return this.data;
  }

  getAllData(): SustainabilityData[] {
    return this.data;
  }

  getUniqueCountries(): string[] {
    return [...new Set(this.data.map((row) => row.Country))]
      .filter(Boolean)
      .sort();
  }

  getUniqueRegions(): string[] {
    return [...new Set(this.data.map((row) => row.Region))]
      .filter(Boolean)
      .sort();
  }

  getUniqueIncomeGroups(): string[] {
    return [...new Set(this.data.map((row) => row["Income group"]))]
      .filter(Boolean)
      .sort();
  }

  getTotalCountries(): number {
    return this.getUniqueCountries().length;
  }

  getTotalYears(): number {
    const years = [...new Set(this.data.map((row) => row.Year))];
    return years.length;
  }

  getTotalRecords(): number {
    return this.data.length;
  }

  getFilteredData(filters: FilterOptions = {}): SustainabilityData[] {
    return this.data.filter((row) => {
      if (filters.countries && filters.countries.length > 0) {
        if (!filters.countries.includes(row.Country)) return false;
      }

      if (filters.years && filters.years.length > 0) {
        if (!filters.years.includes(row.Year)) return false;
      }

      if (filters.continents && filters.continents.length > 0) {
        if (!filters.continents.includes(row.Region)) return false;
      }

      if (
        filters.incomeClassifications &&
        filters.incomeClassifications.length > 0
      ) {
        if (!filters.incomeClassifications.includes(row["Income group"]))
          return false;
      }

      if (filters.regimeTypes && filters.regimeTypes.length > 0) {
        if (
          !filters.regimeTypes.includes(
            row["Regime Type (RoW Measure Definition)"] as string
          )
        )
          return false;
      }

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const searchFields = [
          row.Country,
          row.Region,
          row["Income group"],
          row["Regime Type (RoW Measure Definition)"] as string,
          row["World Regions (UN SDG Definition)"] as string,
        ];

        const matchesSearch = searchFields.some(
          (field) => field && field.toLowerCase().includes(searchLower)
        );

        if (!matchesSearch) return false;
      }

      return true;
    });
  }

  getUniqueValues(field: keyof SustainabilityData): string[] {
    const values = this.data
      .map((row) => row[field])
      .filter((value, index, arr) => value && arr.indexOf(value) === index);

    return values.sort() as string[];
  }

  getDatasetInfo(): DatasetInfo {
    const countries = this.getUniqueCountries().length;
    const years = this.data.map((row) => row.Year).filter((year) => year);
    const yearRange: [number, number] = [
      Math.min(...years),
      Math.max(...years),
    ];

    return {
      name: "World Sustainability Dataset",
      description:
        "Comprehensive sustainability metrics covering environmental, social, and economic indicators across 173 countries over 19 years (2000-2018). Data sourced from the World Bank, UN, and other international organizations.",
      source: "Kaggle TrueCue Women+Data Hackathon",
      lastUpdated: "2024",
      totalRecords: this.data.length,
      countries,
      yearRange,
      metrics: 54,
    };
  }

  getCountryData(countryName: string): SustainabilityData[] {
    return this.data.filter((row) => row.Country === countryName);
  }

  getCountryTimeSeries(
    countryName: string,
    metric: keyof SustainabilityData
  ): Array<{ year: number; value: number | null }> {
    return this.getCountryData(countryName)
      .map((row) => ({
        year: row.Year,
        value: row[metric] as number | null,
      }))
      .sort((a, b) => a.year - b.year);
  }

  getRegionalAggregates(
    metric: keyof SustainabilityData,
    year?: number
  ): Array<{ region: string; average: number; count: number }> {
    const filteredData = year
      ? this.data.filter((row) => row.Year === year)
      : this.data;

    const regionData = new Map<string, number[]>();

    filteredData.forEach((row) => {
      const region = row.Region;
      const value = row[metric] as number | null;

      if (region && value !== null && value !== undefined) {
        if (!regionData.has(region)) {
          regionData.set(region, []);
        }
        regionData.get(region)!.push(value);
      }
    });

    return Array.from(regionData.entries()).map(([region, values]) => ({
      region,
      average: values.reduce((sum, val) => sum + val, 0) / values.length,
      count: values.length,
    }));
  }

  calculateCorrelation(
    metric1: keyof SustainabilityData,
    metric2: keyof SustainabilityData
  ): number {
    const pairs = this.data
      .map((row) => [row[metric1] as number, row[metric2] as number])
      .filter(([x, y]) => x !== null && y !== null && !isNaN(x) && !isNaN(y));

    if (pairs.length < 2) return 0;

    const n = pairs.length;
    const sumX = pairs.reduce((sum, [x]) => sum + x, 0);
    const sumY = pairs.reduce((sum, [, y]) => sum + y, 0);
    const sumXY = pairs.reduce((sum, [x, y]) => sum + x * y, 0);
    const sumX2 = pairs.reduce((sum, [x]) => sum + x * x, 0);
    const sumY2 = pairs.reduce((sum, [, y]) => sum + y * y, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
    );

    return denominator === 0 ? 0 : numerator / denominator;
  }

  getMetricSummary(metric: keyof SustainabilityData): {
    min: number;
    max: number;
    mean: number;
    median: number;
    count: number;
  } {
    const values = this.data
      .map((row) => row[metric] as number)
      .filter((val) => val !== null && val !== undefined && !isNaN(val))
      .sort((a, b) => a - b);

    if (values.length === 0) {
      return { min: 0, max: 0, mean: 0, median: 0, count: 0 };
    }

    const min = values[0];
    const max = values[values.length - 1];
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const median =
      values.length % 2 === 0
        ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2
        : values[Math.floor(values.length / 2)];

    return { min, max, mean, median, count: values.length };
  }

  exportData(
    filters: FilterOptions = {},
    format: "csv" | "json" = "csv"
  ): string {
    const filteredData = this.getFilteredData(filters);

    if (format === "json") {
      return JSON.stringify(filteredData, null, 2);
    }

    return Papa.unparse(filteredData);
  }
}

export const sustainabilityDataProcessor = new SustainabilityDataProcessor();

export async function loadSustainabilityData(): Promise<{
  data: SustainabilityData[];
  processor: SustainabilityDataProcessor;
}> {
  await sustainabilityDataProcessor.loadData();
  return {
    data: sustainabilityDataProcessor.getAllData(),
    processor: sustainabilityDataProcessor,
  };
}

export const METRIC_CATEGORIES = {
  environmental: [
    "Access to electricity (% of population) - EG.ELC.ACCS.ZS",
    "Adjusted savings: carbon dioxide damage (% of GNI) - NY.ADJ.DCO2.GN.ZS",
    "Adjusted savings: natural resources depletion (% of GNI) - NY.ADJ.DRES.GN.ZS",
    "Adjusted savings: net forest depletion (% of GNI) - NY.ADJ.DFOR.GN.ZS",
    "Adjusted savings: particulate emission damage (% of GNI) - NY.ADJ.DPEM.GN.ZS",
    "Renewable electricity output (% of total electricity output) - EG.ELC.RNEW.ZS",
    "Renewable energy consumption (% of total final energy consumption) - EG.FEC.RNEW.ZS",
    "Annual production-based emissions of carbon dioxide (CO2), measured in million tonnes",
    "Total natural resources rents (% of GDP) - NY.GDP.TOTL.RT.ZS",
    "Proportion of population using basic drinking water services (%) - SP_ACS_BSRVH2O - 1.4.1",
  ],
  social: [
    "Children out of school (% of primary school age) - SE.PRM.UNER.ZS",
    "Compulsory education, duration (years) - SE.COM.DURS",
    "Primary completion rate, total (% of relevant age group) - SE.PRM.CMPT.ZS",
    "Proportion of seats held by women in national parliaments (%) - SG.GEN.PARL.ZS",
    "Pupil-teacher ratio, primary - SE.PRM.ENRL.TC.ZS",
    "School enrollment, preprimary (% gross) - SE.PRE.ENRR",
    "School enrollment, primary (% gross) - SE.PRM.ENRR",
    "School enrollment, secondary (% gross) - SE.SEC.ENRR",
    "Women Business and the Law Index Score (scale 1-100) - SG.LAW.INDX",
    "Prevalence of undernourishment (%) - SN_ITK_DEFC - 2.1.1",
    "Proportion of population below international poverty line (%) - SI_POV_DAY1 - 1.1.1",
    "Unemployment rate, male (%) - SL_TLF_UEM - 8.5.2",
    "Unemployment rate, women (%) - SL_TLF_UEM - 8.5.2",
    "Gini index (World Bank estimate) - SI.POV.GINI",
    "Individuals using the Internet (% of population) - IT.NET.USER.ZS",
    "Life expectancy at birth, total (years) - SP.DYN.LE00.IN",
    "Population, total - SP.POP.TOTL",
    "Rural population (% of total population) - SP.RUR.TOTL.ZS",
    "Urban population (% of total population) - SP.URB.TOTL.IN.ZS",
  ],
  economic: [
    "Adjusted net national income per capita (annual % growth) - NY.ADJ.NNTY.PC.KD.ZG",
    "Adjusted net savings, excluding particulate emission damage (% of GNI) - NY.ADJ.SVNX.GN.ZS",
    "Automated teller machines (ATMs) (per 100,000 adults) - FB.ATM.TOTL.P5",
    "Broad money (% of GDP) - FM.LBL.BMNY.GD.ZS",
    "Cost of business start-up procedures, female (% of GNI per capita) - IC.REG.COST.PC.FE.ZS",
    "Cost of business start-up procedures, male (% of GNI per capita) - IC.REG.COST.PC.MA.ZS",
    "Exports of goods and services (% of GDP) - NE.EXP.GNFS.ZS",
    "Final consumption expenditure (% of GDP) - NE.CON.TOTL.ZS",
    "GDP (current US$) - NY.GDP.MKTP.CD",
    "GDP per capita (current US$) - NY.GDP.PCAP.CD",
    "General government final consumption expenditure (% of GDP) - NE.CON.GOVT.ZS",
    "Gross national expenditure (% of GDP) - NE.DAB.TOTL.ZS",
    "Gross savings (% of GDP) - NY.GNS.ICTR.ZS",
    "Imports of goods and services (% of GDP) - NE.IMP.GNFS.ZS",
    "Inflation, consumer prices (annual %) - FP.CPI.TOTL.ZG",
    "Trade (% of GDP) - NE.TRD.GNFS.ZS",
  ],
  technology: [
    "Proportion of population covered by at least a 2G mobile network (%) - IT_MOB_2GNTWK - 9.c.1",
    "Proportion of population covered by at least a 3G mobile network (%) - IT_MOB_3GNTWK - 9.c.1",
    "Individuals using the Internet (% of population) - IT.NET.USER.ZS",
  ],
};

export const FRIENDLY_METRIC_NAMES: Record<string, string> = {
  "Access to electricity (% of population) - EG.ELC.ACCS.ZS":
    "Access to Electricity",
  "Adjusted net national income per capita (annual % growth) - NY.ADJ.NNTY.PC.KD.ZG":
    "Net National Income Growth",
  "GDP per capita (current US$) - NY.GDP.PCAP.CD": "GDP per Capita",
  "Life expectancy at birth, total (years) - SP.DYN.LE00.IN": "Life Expectancy",
  "Renewable electricity output (% of total electricity output) - EG.ELC.RNEW.ZS":
    "Renewable Electricity",
  "Annual production-based emissions of carbon dioxide (CO2), measured in million tonnes":
    "CO2 Emissions",
  "Individuals using the Internet (% of population) - IT.NET.USER.ZS":
    "Internet Usage",
  "Proportion of seats held by women in national parliaments (%) - SG.GEN.PARL.ZS":
    "Women in Parliament",
};

const processDataRow = (row: Record<string, string>): SustainabilityData => {
  const processedRow: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(row)) {
    if (value === "" || value === null || value === undefined) {
      processedRow[key] = null;
    } else if (key === "Country" || key === "Region") {
      processedRow[key] = value.toString();
    } else if (key === "Year") {
      processedRow[key] = parseInt(value, 10);
    } else {
      const numValue = parseFloat(value);
      processedRow[key] = isNaN(numValue) ? value : numValue;
    }
  }

  return processedRow as SustainabilityData;
};
