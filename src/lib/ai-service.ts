import { GoogleGenerativeAI } from "@google/generative-ai";
import { SustainabilityData } from "./data-processing";

interface InsightResponse {
  insights: string[];
  summary: string;
  recommendations: string[];
  trend_analysis: string;
}

export class SustainabilityAI {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (apiKey && apiKey !== "your_api_key_here") {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async generateInsights(
    filteredData: SustainabilityData[],
    context: {
      totalRecords: number;
      uniqueCountries: number;
      yearRange: string;
      filterDescription?: string;
    }
  ): Promise<InsightResponse> {
    if (!this.genAI || filteredData.length === 0) {
      return this.generateBasicInsights(filteredData, context);
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const dataSample = this.prepareSampleData(filteredData);
      const statistics = this.calculateStatistics(filteredData);

      const prompt = this.buildAnalysisPrompt(dataSample, statistics, context);

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseAIResponse(text);
    } catch (error) {
      console.error("Gemini AI Error:", error);
      return this.generateBasicInsights(filteredData, context);
    }
  }

  private prepareSampleData(data: SustainabilityData[]): any[] {
    return data.slice(0, 5).map((item) => ({
      country: item.Country,
      year: item.Year,
      region: item.Region,
      income_group: item["Income group"],
      carbon_emissions: item["Carbon emissions (metric tons per capita)"],
      renewable_energy:
        item[
          "Renewable energy consumption (% of total final energy consumption)"
        ],
      gdp_per_capita: item["GDP per capita (current US$)"],
      life_expectancy: item["Life expectancy at birth, total (years)"],
      forest_area: item["Forest area (% of land area)"],
    }));
  }

  private calculateStatistics(data: SustainabilityData[]) {
    const carbonEmissions = data
      .map((d) => Number(d["Carbon emissions (metric tons per capita)"]))
      .filter((val) => !isNaN(val));

    const renewableEnergy = data
      .map((d) =>
        Number(
          d[
            "Renewable energy consumption (% of total final energy consumption)"
          ]
        )
      )
      .filter((val) => !isNaN(val));

    const gdpPerCapita = data
      .map((d) => Number(d["GDP per capita (current US$)"]))
      .filter((val) => !isNaN(val));

    const lifeExpectancy = data
      .map((d) => Number(d["Life expectancy at birth, total (years)"]))
      .filter((val) => !isNaN(val));

    return {
      carbon: {
        avg:
          carbonEmissions.length > 0
            ? carbonEmissions.reduce((a, b) => a + b, 0) /
              carbonEmissions.length
            : 0,
        min: carbonEmissions.length > 0 ? Math.min(...carbonEmissions) : 0,
        max: carbonEmissions.length > 0 ? Math.max(...carbonEmissions) : 0,
      },
      renewable: {
        avg:
          renewableEnergy.length > 0
            ? renewableEnergy.reduce((a, b) => a + b, 0) /
              renewableEnergy.length
            : 0,
        min: renewableEnergy.length > 0 ? Math.min(...renewableEnergy) : 0,
        max: renewableEnergy.length > 0 ? Math.max(...renewableEnergy) : 0,
      },
      gdp: {
        avg:
          gdpPerCapita.length > 0
            ? gdpPerCapita.reduce((a, b) => a + b, 0) / gdpPerCapita.length
            : 0,
        min: gdpPerCapita.length > 0 ? Math.min(...gdpPerCapita) : 0,
        max: gdpPerCapita.length > 0 ? Math.max(...gdpPerCapita) : 0,
      },
      life_expectancy: {
        avg:
          lifeExpectancy.length > 0
            ? lifeExpectancy.reduce((a, b) => a + b, 0) / lifeExpectancy.length
            : 0,
        min: lifeExpectancy.length > 0 ? Math.min(...lifeExpectancy) : 0,
        max: lifeExpectancy.length > 0 ? Math.max(...lifeExpectancy) : 0,
      },
    };
  }

  private buildAnalysisPrompt(
    dataSample: any[],
    statistics: any,
    context: any
  ): string {
    return `
As a sustainability data expert, analyze this dataset and provide insights in JSON format.

DATASET CONTEXT:
- Total Records: ${context.totalRecords}
- Countries: ${context.uniqueCountries}
- Time Period: ${context.yearRange}
- Filter Applied: ${context.filterDescription || "None"}

STATISTICAL SUMMARY:
- Average Carbon Emissions: ${statistics.carbon.avg.toFixed(
      2
    )} metric tons per capita
- Average Renewable Energy: ${statistics.renewable.avg.toFixed(1)}%
- Average GDP per Capita: $${statistics.gdp.avg.toLocaleString()}
- Average Life Expectancy: ${statistics.life_expectancy.avg.toFixed(1)} years

SAMPLE DATA (first 5 records):
${JSON.stringify(dataSample, null, 2)}

Please provide analysis in this exact JSON format:
{
  "insights": [
    "Key insight 1 about environmental patterns",
    "Key insight 2 about social indicators",
    "Key insight 3 about economic trends"
  ],
  "summary": "Brief summary of overall sustainability performance",
  "recommendations": [
    "Recommendation 1 for improvement",
    "Recommendation 2 for policy makers"
  ],
  "trend_analysis": "Analysis of trends and patterns observed in the data"
}

Focus on:
1. Environmental indicators (carbon emissions, renewable energy, forest coverage)
2. Social development (life expectancy, education, healthcare)
3. Economic sustainability (GDP, income distribution)
4. Regional or income group patterns
5. Year-over-year trends if multiple years present

Provide specific, actionable insights based on the actual data values.
`;
  }

  private parseAIResponse(text: string): InsightResponse {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          insights: parsed.insights || [],
          summary: parsed.summary || "",
          recommendations: parsed.recommendations || [],
          trend_analysis: parsed.trend_analysis || "",
        };
      }
    } catch (error) {
      console.error("Failed to parse AI response:", error);
    }

    return {
      insights: [
        "Unable to parse detailed AI insights at this time",
        "Please try again or check your data selection",
      ],
      summary: "Analysis temporarily unavailable",
      recommendations: ["Please try again with different filters"],
      trend_analysis: "Trend analysis temporarily unavailable",
    };
  }

  private generateBasicInsights(
    data: SustainabilityData[],
    context: any
  ): InsightResponse {
    const insights: string[] = [];
    const recommendations: string[] = [];

    if (data.length === 0) {
      return {
        insights: ["No data available for the current selection"],
        summary: "No data to analyze",
        recommendations: ["Try adjusting your filters to include more data"],
        trend_analysis: "No trends available",
      };
    }

    const carbonData = data
      .map((d) => Number(d["Carbon emissions (metric tons per capita)"]))
      .filter((val) => !isNaN(val));

    const renewableData = data
      .map((d) =>
        Number(
          d[
            "Renewable energy consumption (% of total final energy consumption)"
          ]
        )
      )
      .filter((val) => !isNaN(val));

    const gdpData = data
      .map((d) => Number(d["GDP per capita (current US$)"]))
      .filter((val) => !isNaN(val));

    if (carbonData.length > 0) {
      const avgCarbon =
        carbonData.reduce((a, b) => a + b, 0) / carbonData.length;
      insights.push(
        `Average carbon emissions: ${avgCarbon.toFixed(
          2
        )} metric tons per capita`
      );

      if (avgCarbon > 10) {
        recommendations.push(
          "Focus on reducing carbon emissions through renewable energy transition"
        );
      } else if (avgCarbon < 2) {
        insights.push(
          "Low carbon emissions indicate good environmental performance"
        );
      }
    }

    if (renewableData.length > 0) {
      const avgRenewable =
        renewableData.reduce((a, b) => a + b, 0) / renewableData.length;
      insights.push(
        `Average renewable energy usage: ${avgRenewable.toFixed(1)}%`
      );

      if (avgRenewable < 20) {
        recommendations.push(
          "Increase investment in renewable energy infrastructure"
        );
      } else if (avgRenewable > 50) {
        insights.push(
          "Strong renewable energy adoption indicates sustainable energy practices"
        );
      }
    }

    if (gdpData.length > 0) {
      const avgGDP = gdpData.reduce((a, b) => a + b, 0) / gdpData.length;
      insights.push(`Average GDP per capita: $${avgGDP.toLocaleString()}`);
    }

    const uniqueRegions = [...new Set(data.map((d) => d.Region))];
    if (uniqueRegions.length > 1) {
      insights.push(
        `Data covers ${
          uniqueRegions.length
        } different regions: ${uniqueRegions.join(", ")}`
      );
    }

    return {
      insights,
      summary: `Analysis of ${context.totalRecords} records from ${context.uniqueCountries} countries (${context.yearRange})`,
      recommendations:
        recommendations.length > 0
          ? recommendations
          : [
              "Continue monitoring sustainability indicators",
              "Focus on balanced environmental, social, and economic development",
            ],
      trend_analysis: `This dataset covers ${context.yearRange} and includes multiple sustainability dimensions for comprehensive analysis.`,
    };
  }

  async askQuestion(
    question: string,
    data: SustainabilityData[],
    context: any
  ): Promise<string> {
    if (!this.genAI || data.length === 0) {
      return "AI analysis is not available. Please check your API configuration or data selection.";
    }

    try {
      // Filter data for country-specific questions
      let relevantData = data;
      const countryKeywords = [
        "brazil",
        "usa",
        "germany",
        "china",
        "india",
        "france",
        "japan",
        "canada",
        "australia",
        "uk",
        "united kingdom",
        "united states",
      ];
      const questionLower = question.toLowerCase();

      for (const keyword of countryKeywords) {
        if (questionLower.includes(keyword)) {
          const countryData = data.filter(
            (row) =>
              row.Country.toLowerCase().includes(keyword) ||
              (keyword === "usa" &&
                row.Country.toLowerCase().includes("united states")) ||
              (keyword === "uk" &&
                row.Country.toLowerCase().includes("united kingdom"))
          );
          if (countryData.length > 0) {
            relevantData = countryData;
            break;
          }
        }
      }

      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const dataSample = this.prepareSampleData(relevantData);
      const statistics = this.calculateStatistics(relevantData);

      const prompt = `
You are a sustainability data expert. Answer this question based on the provided dataset:

QUESTION: ${question}

DATASET CONTEXT:
- Records analyzed: ${relevantData.length}
- Countries in analysis: ${
        [...new Set(relevantData.map((d) => d.Country))].length
      }
- Time Period: ${context.yearRange}
- Sample includes: ${[...new Set(relevantData.map((d) => d.Country))]
        .slice(0, 5)
        .join(", ")}

STATISTICS:
- Avg Carbon Emissions: ${statistics.carbon.avg.toFixed(2)} MT per capita
- Avg Renewable Energy: ${statistics.renewable.avg.toFixed(1)}%
- Avg GDP per Capita: $${statistics.gdp.avg.toLocaleString()}
- Avg Life Expectancy: ${statistics.life_expectancy.avg.toFixed(1)} years

SAMPLE DATA:
${JSON.stringify(dataSample.slice(0, 3), null, 2)}

Provide a clear, concise answer based on the data. If the question cannot be answered from the available data, explain what data would be needed.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini AI Question Error:", error);
      return "Sorry, I couldn't process your question. Please try again or rephrase your question.";
    }
  }

  private async makeRequest(
    prompt: string,
    context: string
  ): Promise<AIResponse> {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, context }),
    });

    if (!response.ok) {
      throw new Error(`AI request failed: ${response.statusText}`);
    }

    return response.json();
  }

  private processQuestionForCountry(question: string): string | null {
    const countryKeywords: Record<string, string> = {
      brazil: "brazil",
      usa: "united states",
      germany: "germany",
      china: "china",
      india: "india",
      france: "france",
      japan: "japan",
      canada: "canada",
      australia: "australia",
      uk: "united kingdom",
      "united kingdom": "united kingdom",
      "united states": "united states",
    };

    const questionLower = question.toLowerCase();
    for (const [keyword, country] of Object.entries(countryKeywords)) {
      if (questionLower.includes(keyword)) {
        return country;
      }
    }
    return null;
  }

  private formatDataForAI(data: SustainabilityData[]): string {
    if (data.length === 0) return "No data available";

    const recentData = data.slice(-100);
    const countries = [...new Set(recentData.map((d) => d.Country))].slice(
      0,
      10
    );
    const metrics = Object.keys(recentData[0] || {})
      .filter((key) => !["Country", "Year", "Region"].includes(key))
      .slice(0, 15);

    return `Dataset contains ${data.length} records from ${
      countries.length
    } countries.
Recent data sample: ${recentData.length} records.
Countries included: ${countries.join(", ")}
Available metrics: ${metrics.join(", ")}
Sample data: ${JSON.stringify(recentData.slice(0, 3), null, 2)}`;
  }

  private extractInsights(aiResponse: AIResponse): string {
    if (aiResponse.choices && aiResponse.choices.length > 0) {
      return aiResponse.choices[0].message?.content || "No insights generated";
    }
    return aiResponse.content || "No insights available";
  }
}
