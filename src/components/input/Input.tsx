import React, {ReactElement, useState} from "react";
import {ICity} from "../App";
import {CommonLocality, getCitiesByName, LOCALITY_TYPE_CODE} from "../../geoApi";
import styles from "./Input.module.sass";

interface Props {
    getCityData(city: ICity): void
}

export default function Input ({ getCityData }:Props): ReactElement {
    let [inputValue, setInputValue] = useState<string>(''),
        [selectedCity, setSelectedCity] = useState<ICity>(),
        [searchResult, setSearchResult] = useState<CommonLocality[]>([]),
        [currentTimeout, setCurrentTimeout] = useState<ReturnType<typeof setTimeout>>()

    const search = (text: string): void => {
        setInputValue(text)
        if (text.length>2) {
            if (!searchResult.length)
            if (currentTimeout) clearTimeout(currentTimeout)
            let currentTO = setTimeout(()=>getCitiesByName(text).then( (data:CommonLocality[]): void => setSearchResult(data)), 300)
            setCurrentTimeout(currentTO)
        }
        else
            setSearchResult([])
            if (currentTimeout) clearTimeout(currentTimeout)
    }

    return (
        <div className={styles.block}>
            <div className={styles.search}>
                <input
                    type="text"
                    className={styles.search__input}
                    value={inputValue}
                    placeholder="Введите название населенного пункта России"
                    onChange={(e) => {
                            setSelectedCity(undefined)
                            search(e.target.value)
                        }
                    }/>
                <div className={inputValue.length>2 && !searchResult.length ? styles.loader_active : styles.loader_disactive}>
                    Загрузка городов...
                </div>
                <div className={`${styles.search__list} ${!searchResult.length ? styles.search__list_disactive : ''}`}>
                    {searchResult.map((city: CommonLocality):ReactElement =>
                        <div
                            key={city.id}
                            data-info={city}
                            onClick={(e) => {
                                setSelectedCity(city)
                                setInputValue(city.name)
                            }}
                        >
                            {city.name}{ (!city.localityType || city.localityType?.code !== LOCALITY_TYPE_CODE.city) && city.area ? `, ${city.area} район` : ''}
                        </div>
                    )}
                </div>
            </div>
            <button
                className={`${styles.button} ${selectedCity ? styles.button_active : styles.button_disactive}`}
                data-warning="Выберите населенный пункт"
                onClick={
                    () => {
                        if (selectedCity) {
                            getCityData(selectedCity as ICity)
                            setInputValue('')
                            setSearchResult([])
                            setSelectedCity(undefined)
                            setCurrentTimeout(undefined)
                        }
                    }
                }>Добавить</button>
        </div>
    )
}
