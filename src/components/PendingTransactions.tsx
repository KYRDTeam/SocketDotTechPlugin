import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ActiveRouteResponse } from "@socket.tech/socket-v2-sdk";
import { CustomizeContext } from "../providers/CustomizeProvider";

// components
import { Modal } from "./common/Modal";

// actions
import { setActiveRoute, setIsTxModalOpen } from "../state/modals";

import { usePendingRoutes } from "../hooks/apis";
import { TokenDetailsRow } from "./common/TokenDetailsRow";

// Pending Transactions are basically routes that have not been completed yet. User can continue from the previous step whenever he opens the modal again.
export const PendingTransactions = () => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeRoutes, setActiveRoutes] = useState<ActiveRouteResponse[]>(null);
  const [totalRoutes, setTotalRoutes] = useState<number>(0);
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  // Hook that fetches the routes that are active (routes that have started but have not been completed yet.)
  const { data: activeRoutesData } = usePendingRoutes();

  useEffect(() => {
    if (activeRoutesData) {
      setTotalRoutes(activeRoutesData?.result?.pagination?.totalRecords);
      setActiveRoutes(activeRoutesData?.result?.activeRoutes);
    }
  }, [activeRoutesData]);

  function openTxModal(route) {
    dispatch(setActiveRoute(route));
    dispatch(setIsTxModalOpen(true));
    setIsModalOpen(false);
  }

  if (totalRoutes > 0)
    return (
      <>
        <button
          className="skt-w skt-w-button skt-w-input uppercase text-sm px-2 py-0.5 bg-primary-200 shadow-inner bg-opacity-90 text-widget-onAccent"
          onClick={() => setIsModalOpen(true)}
          style={{ borderRadius: `calc(0.75rem * ${borderRadius})` }}
        >
          {totalRoutes} pending
        </button>

        {isModalOpen && (
          <Modal
            title="Pending Transactions"
            closeModal={() => setIsModalOpen(false)}
            style={{ display: isModalOpen ? "block" : "none" }}
            noPadding
          >
            <div className="skt-w flex flex-col justify-start flex-1 overflow-y-auto">
              <p className="skt-w px-8 text-widget-secondary text-xs py-2 text-left">
                Transaction status is updated every 30 seconds
              </p>

              {activeRoutes?.map((route: any) => {
                const refuelSourceToken = {
                  amount: route?.refuel?.fromAmount,
                  asset: route?.refuel?.fromAsset,
                };
                const refuelDestToken = {
                  amount: route?.refuel?.toAmount,
                  asset: route?.refuel?.toAsset,
                };

                return (
                  <TokenDetailsRow
                    key={route?.activeRouteId}
                    onClick={() => openTxModal(route)}
                    srcDetails={{
                      token: route?.fromAsset,
                      amount: route?.fromAmount,
                    }}
                    destDetails={{
                      token: route?.toAsset,
                      amount: route?.toAmount,
                    }}
                    srcRefuel={refuelSourceToken}
                    destRefuel={refuelDestToken}
                  />
                );
              })}

              <p className="skt-w px-8 text-widget-secondary text-xs py-2 text-left">
                Showing {activeRoutes?.length}/{totalRoutes} active routes
              </p>
            </div>
          </Modal>
        )}
      </>
    );
  else return null;
};
