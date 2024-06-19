export default `
    body {
        display: block;
        position: relative;
    }

    #global-loader {
        position: fixed;
        z-index: 1700;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: #e4e4d8;
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;

        svg {
            overflow: visible;
            width: 98px;
            height: auto;
        }
    }

    #global-loader .spinner {
        animation: pulse 1s infinite;
    }

    #global-loader img {
        border-radius: 7px;
    }

    @keyframes pulse {
        0% {
            transform: scale(0.95);
        }

        70% {
            transform: scale(1);
        }

        100% {
            transform: scale(0.95);
        }
    }
`;
