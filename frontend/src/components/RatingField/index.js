import styles from './RatingField.module.css';

const RatingField = ({ name, value, onChange }) => {
    const maxRating = 5;

    const handleClick = (rating) => {
        onChange({ target: { name, value: rating } });
    };

    return (
        <div className={styles.row}>
            <div className={styles['rating-icons']}>
                {[...Array(maxRating)].map((_, index) => (
                    <img
                        key={index}
                        src={value > index ? '/images/full_paw.svg' : '/images/empty_paw.svg'}
                        alt="Paw Icon"
                        className={styles['rating-icon']}
                        onClick={() => handleClick(index + 1)}
                    />
                ))}
            </div>
        </div>
    );
};

export default RatingField;
