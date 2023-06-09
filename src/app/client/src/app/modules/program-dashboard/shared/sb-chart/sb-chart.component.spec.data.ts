export const mockChart = {
  chart: {
    chartConfig: {
      id: "ml_district_wise_unique_users_who_submitted_form_api_test_pabitra_new1",
      colors: [
        {
          borderColor: "rgb(0, 199, 134)",
          borderWidth: 2,
          backgroundColor: "rgba(0, 199, 134, 0.3)",
        },
        {
          borderColor: "rgb(255, 161, 29)",
          borderWidth: 2,
          backgroundColor: "rgba(255, 161, 29, 0.3)",
        },
        {
          borderColor: "rgb(255, 69, 88)",
          borderWidth: 2,
          backgroundColor: "rgba(255, 69, 88, 0.3)",
        },
        {
          borderColor: "rgb(242, 203, 28)",
          borderWidth: 2,
          backgroundColor: "rgba(242, 203, 28, 0.3)",
        },
        {
          borderColor: "rgb(55, 70, 73)",
          borderWidth: 2,
          backgroundColor: "rgba(55, 70, 73, 0.3)",
        },
      ],
      filters: [
        {
          reference: "district_name",
          controlType: "multi-select",
          displayName: "District",
        },
        {
          reference: "organisation_name",
          controlType: "multi-select",
          displayName: "Organisation",
        },
      ],
      options: {
        title: {
          text: "District-wise unique users who submitted form",
          display: true,
          fontSize: 16,
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                autoSkip: false,
              },
              scaleLabel: {
                display: true,
                labelString: "District name",
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                precision: 0,
                beginAtZero: true,
              },
              scaleLabel: {
                display: true,
                labelString: "No. of unique users",
              },
            },
          ],
        },
        tooltips: {
          mode: "x-axis",
          intersect: false,
          bodySpacing: 5,
          titleSpacing: 5,
        },
        responsive: true,
        showLastUpdatedOn: true,
      },
      datasets: [
        {
          label: "No of unique users",
          dataExpr: "No of unique users",
        },
      ],
      chartType: "bar",
      dataSource: {
        ids: [
          "ml_district_wise_unique_users_who_submitted_form_api_test_pabitra_new1",
        ],
        commonDimension: "district_name",
      },
      labelsExpr: "district_name",
    },
    chartData: [
      {
        Started: "1.0",
        district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
        "Program name": "Observation led projects testing",
        program_id: "607d320de9cce45e22ce90c0",
        "In Progress": "2.0",
        Completed: "3.0",
        "Observation name": "Leadership Self Assessment(Percentage)",
        solution_id: "60a245158eee6c5040d16a4a",
        "Rating Pending": "0.0",
        organisation_name: "KirubaOrg2.1",
        organisation_id: "0127920475840593920",
        Date: "2022-07-17",
        district_name: "ANANTAPUR",
      },
      {
        Started: "26.0",
        district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
        "Program name": "Observation led projects testing",
        program_id: "607d320de9cce45e22ce90c0",
        "In Progress": "7.0",
        Completed: "19.0",
        "Observation name": "Leadership Self Assessment(Percentage)",
        solution_id: "60a245158eee6c5040d16a4a",
        "Rating Pending": "1.0",
        organisation_name: "Staging Custodian Organization",
        organisation_id: "0126796199493140480",
        Date: "2022-07-17",
        district_name: "ANANTAPUR",
      },
      {
        Started: "1.0",
        district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
        "Program name": "Observation led projects testing",
        program_id: "607d320de9cce45e22ce90c0",
        "In Progress": "0.0",
        Completed: "6.0",
        "Observation name": "Leadership Self Assessment(Percentage)",
        solution_id: "60a245158eee6c5040d16a4a",
        "Rating Pending": "0.0",
        organisation_name: "unknown",
        organisation_id: "unknown",
        Date: "2022-07-17",
        district_name: "ANANTAPUR",
      },
    ],
    lastUpdatedOn: 1655367174000,
  },
  filter: {
    allFilters: [
      {
        reference: "district_name",
        controlType: "multi-select",
        displayName: "District",
        options: ["anantapur", "chittoor", "guntur", "krishna", "unknown"],
      },
      {
        reference: "organisation_name",
        controlType: "multi-select",
        displayName: "Organisation",
        options: ["kirubaorg2.1", "staging custodian organization", "unknown"],
      },
    ],
    filters: {
      district_name: ["anantapur"],
    },
    chartData: [
      {
        id: "district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five",
        data: [
          {
            Started: "1.0",
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "2.0",
            Completed: "3.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "0.0",
            organisation_name: "KirubaOrg2.1",
            organisation_id: "0127920475840593920",
            Date: "2022-07-17",
            district_name: "ANANTAPUR",
          },
          {
            Started: "26.0",
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "7.0",
            Completed: "19.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "1.0",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            district_name: "ANANTAPUR",
          },
          {
            Started: "1.0",
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "0.0",
            Completed: "6.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "0.0",
            organisation_name: "unknown",
            organisation_id: "unknown",
            Date: "2022-07-17",
            district_name: "ANANTAPUR",
          },
        ],
      },
    ],
  },
  noFilters: {
    chartData: [
      {
        id: "district_wise_no_of_submissions_vs_observation_status_new_new_new_api_test_pabitra_new1_final_five",
        data: [
          {
            Started: "1.0",
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "2.0",
            Completed: "3.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "0.0",
            organisation_name: "KirubaOrg2.1",
            organisation_id: "0127920475840593920",
            Date: "2022-07-17",
            district_name: "ANANTAPUR",
          },
          {
            Started: "26.0",
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "7.0",
            Completed: "19.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "1.0",
            organisation_name: "Staging Custodian Organization",
            organisation_id: "0126796199493140480",
            Date: "2022-07-17",
            district_name: "ANANTAPUR",
          },
          {
            Started: "1.0",
            district_externalId: "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03",
            "Program name": "Observation led projects testing",
            program_id: "607d320de9cce45e22ce90c0",
            "In Progress": "0.0",
            Completed: "6.0",
            "Observation name": "Leadership Self Assessment(Percentage)",
            solution_id: "60a245158eee6c5040d16a4a",
            "Rating Pending": "0.0",
            organisation_name: "unknown",
            organisation_id: "unknown",
            Date: "2022-07-17",
            district_name: "ANANTAPUR",
          },
        ],
      },
    ],
  },
};
