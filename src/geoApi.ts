enum API_PARAMS {
    API_KEY = 'apiKey=JoG6oAS6fEAqbcYIQSM5lB9jcbf8MqA7',
    LOCALE_LANG = 'locale%5Blang%5D=ru',
    RUSSIA_ISO = 'filter%5BcountryIso%5D=RU'
}

enum LANG {
    ru = 'ru',
    en = 'en'
}

export enum LOCALITY_TYPE_CODE {
    city = 'city-city',
    village = 'city-village',
    locality = 'city-locality',
    selo = 'city-selo',
    posyolok = 'city-posyolok',
    khutor = 'city-khutor'
}

export interface CommonLocality {
    id: number,
    name: string,
    localityType?: {
        code: LOCALITY_TYPE_CODE,
        name: string,
        localizedNamesShort: {
            [LANG.ru]: string,
            [LANG.en]: string
        },
        localizedNames: {
            [LANG.ru]: string,
            [LANG.en]: string
        }
    },
    population?: number,
    area?: string
}

export interface ApiSearchResult {
    success: boolean,
    language: LANG,
    result: CommonLocality[],
    pagination: {
        limit: number,
        totalCount: number,
        currentPage: number,
        totalPageCount: number,
    }
}

export const getCitiesByName = (name: string): Promise<CommonLocality[]> => {
    const CITY_PARAM: string = `filter%5Bname%5D=${name}`
    return fetch(`http://geohelper.info/api/v1/cities?${API_PARAMS.LOCALE_LANG}&${API_PARAMS.API_KEY}&${API_PARAMS.RUSSIA_ISO}&${CITY_PARAM}`)
        .then((response: {
            ok: boolean,
            statusText: string,
            [key: string]: any
        }): ApiSearchResult => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then((result: ApiSearchResult):CommonLocality[] => result.result)
        /*.then(({ result }: ApiSearchResult): Cities[] => result
                .filter((location: (Cities | NonCities)): location is Cities =>
                    location.localityType.code === LOCALITY_TYPE_CODE.CITY_CITY))*/
}

//добавить: пагинация - 100 элементов на странице, перебор страниц
