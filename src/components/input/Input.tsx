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
        [searchResult, setSearchResult] = useState<CommonLocality[]>([])

    const search = (text: string): void => {
        setInputValue(text)
        if (text.length>2)
            getCitiesByName(text).then( (data:CommonLocality[]): void => setSearchResult(data))
    }

    return (
        <>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                        setSelectedCity(undefined)
                        search(e.target.value)
                    }
                }/>
            <div>
                {searchResult.map((city: CommonLocality):ReactElement =>
                    <div
                        key={city.id}
                        data-info={city}
                        onClick={(e) => {
                            setSelectedCity(city)
                            setInputValue(city.name)
                        }}
                    >
                        {city.name}{ !city.localityType || city.localityType?.code !== LOCALITY_TYPE_CODE.city ? `, ${city.area} район` : ''}
                    </div>
                )}
            </div>
            <button
                className={selectedCity ? styles.buttonActive : styles.buttonDisactive}
                onClick={
                    () => {
                        if (selectedCity) getCityData(selectedCity as ICity)
                    }
                }>Добавить</button>
        </>
    )
}
