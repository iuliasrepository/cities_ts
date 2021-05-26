import React, {useState} from 'react';
import styles from './App.module.sass'
import Input from "./input/Input";
import Table from "./table/Table";
import { CommonLocality} from "../geoApi";

export interface ICity {
  id: number,
  name: string,
  type?: string,
  area?: string,
  population?: number
}

function App() {

  const [tableData, setTableData] = useState<ICity[]>([])

  const getCityData = ({id, name, area, population, localityType}: CommonLocality): void => {
      const
          locality: string|undefined = localityType?.localizedNames.ru,
          type: string = locality ? locality[0].toUpperCase() + locality.slice(1) : '',
          city: ICity = {id, name, area, population, type}
      setTableData(prevState => [city].concat(prevState))
  }

  return (
    <div className={styles.app}>
      <div className={styles.inputBlock}>
        <Input getCityData={getCityData}/>
      </div>
      <div className={styles.tableBlock}>
        <Table tableData={tableData} />
          {console.log(tableData)}
      </div>
    </div>
  );
}

export default App;
