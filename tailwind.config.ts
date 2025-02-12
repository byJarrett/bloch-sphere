import type { Config } from "tailwindcss";


export default 
{
    content: [
        "./src/**/*.{html,js,svelte,ts}",
        "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}"
    ],
    darkMode : "class",
    theme: 
    {
        colors: 
        {
            'gray-light' : 
            {
                14 : '#FFFFFF',
                13 : '#F7F8FA',
                12 : '#EBECF0',
                11 : '#DFE1E5',
                10 : '#D3D5DB',
                9 : '#C9CCD6',
                8 : '#A8ADBD',
                7 : '#818594',
                6 : '#6C707E',
                5 : '#5A5D6B',
                4 : '#494B57',
                3 : '#383A42',
                2 : '#27282E',
                1 : '#000000',
            },
            'gray-dark' : 
            {
                14 : '#FFFFFF',
                13 : '#F0F1F2',
                12 : '#DFE1E5',
                11 : '#CED0D6',
                10 : '#B4B8BF',
                9 : '#9DA0A8',
                8 : '#868A91',
                7 : '#6F737A',
                6 : '#5A5D63',
                5 : '#4E5157',
                4 : '#43454A',
                3 : '#393B40',
                2 : '#2B2D30',
                1 : '#1E1F22',
                0 : '#000000',
            },
            'blue-light' : 
            {
                13 : '#F5F8FE',
                12 : '#EDF3FF',
                11 : '#D4E2FF',
                10 : '#C2D6FC',
                9 : '#A0BDF8',
                8 : '#88ADF7',
                7 : '#709CF5',
                6 : '#588CF3',
                5 : '#4682FA',
                4 : '#3574F0',
                3 : '#3369D6',
                2 : '#315FBD',
                1 : '#2E55A3',
            }, 
			'blue-dark' : 
            {                
                11 : '#99BBFF',
                10 : '#83ACFC',
                9 : '#6B9BFA',
                8 : '#F48AF7',
                7 : '#467FF2',
                6 : '#3574F0',
                5 : '#366ACF',
                4 : '#375FAD',
                3 : '#35538F',
                2 : '#2E436E',
                1 : '#25324D',
            },   
            'red-light' : 
            {
                11 : '#FFF7F7',
                10 : '#FFF2F3',
                9 : '#FAB4D8',
                8 : '#F2B6BB',
                7 : '#ED99A1',
                6 : '#E46A76',
                5 : '#E55765',
                4 : '#DB3B4B',
                3 : '#CC3645',
                2 : '#BC303E',
                1 : '#AD2B38'
            },
            'green-light' : 
            {
                11 : '#F2FCF3',
                10 : '#E6F7E9',
                9 : '#C5E5CC',
                8 : '#AFDBBB',
                7 : '#89C398',
                6 : '#55A76A',
                5 : '#369650',
                4 : '#208A3C',
                3 : '#1F8039',
                2 : '#1F7536',
                1 : '#1E6B33'
            }, 
			'green-dark' : 
            {
                11 : '#D4FAD7',
                10 : '#B9EBBD',
                9 : '#A0DBA5',
                8 : '#89CC8E',
                7 : '#73BD79',
                6 : '#5FAD65',
                5 : '#57965C',
                4 : '#4E8052',
                3 : '#436946',
                2 : '#375239',
                1 : '#253627'
            },
			'purple-dark' : 
            {
                11 : '#E4CEFF',
                10 : '#D4B8F9',
                9 : '#C4A0F3',
                8 : '#B589EC',
                7 : '#A571E6',
                6 : '#955AE0',
                5 : '#8150BE',
                4 : '#6C469C',
                3 : '#583D7A',
                2 : '#433358',
                1 : '#2F2936'
            },            
        },

        extend: 
        {
			colors : {
				backgroundPrimary : "var(--background-primary)",
				backgroundSecondary : "var(--background-secondary)",
				backgroundTertiary : "var(--background-tertiary)",
				textPrimary : "var(--text-primary)",
				textSecondary : "var(--text-secondary)",
				textTertiary : "var(--text-tertiary)",
				componentStroke : "var(--component-stroke)",
				componentStrokeDisabled : "var(--component-stroke-disabled)",
				componentFill : "var(--component-fill)",
				componentFillHover : "var(--component-fill-hover)",
				componentFillActive : "var(--component-fill-active)",
				componentFillDisabled : "var(--component-fill-disabled)",
				accent1 : "var(--accent-1)",
				accent2 : "var(--accent-2)",
				accent3 : "var(--accent-3)",
			},

            minHeight : {
                '30' : '30px'
            },

			spacing: {
				18 : '4.8rem'
			},	

			zIndex: {
				'500' : '500'
			}
        }
    },

    plugins: [
        require("@tailwindcss/typography"),
        require('flowbite/plugin')
    ]
} as Config;
