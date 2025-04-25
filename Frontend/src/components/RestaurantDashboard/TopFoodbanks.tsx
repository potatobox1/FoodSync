
import React, { useEffect, useState } from "react";
import styles from "../../styles/topRestaurants.module.css"; 
import { useAppSelector } from "../../redux/hooks";
import { fetchTopFoodbanks } from "../../services/analytics";

interface FoodbankInfo {
  name: string;
  count: number;
}

const TopFoodbanks: React.FC = () => {
  const [topFoodbanks, setTopFoodbanks] = useState<FoodbankInfo[]>([]);
  const restaurantId = useAppSelector((state: any) => state.user.type_id);

  useEffect(() => {
    const loadTopFoodbanks = async () => {
      try {
        const data = await fetchTopFoodbanks(restaurantId);
        setTopFoodbanks(data);
      } catch (error) {
        console.error("Failed to fetch top foodbanks:", error);
      }
    };

    if (restaurantId) loadTopFoodbanks();
  }, [restaurantId]);

  return (
    <div className={styles.container}>
      <div className={styles.tableHeader}>
        <div className={styles.name}>Foodbank</div>
        <div className={styles.donations}>Order Count</div>
      </div>

      {topFoodbanks.map((foodbank, index) => (
        <div key={index} className={styles.tableRow}>
          <div className={styles.name}>{foodbank.name}</div>
          <div className={styles.donations}>{foodbank.count}</div>
        </div>
      ))}
    </div>
  );
};

export default TopFoodbanks;
